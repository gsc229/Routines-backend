const Routine = require("../models/Routine");
const Week = require("../models/RoutineWeek");
const SetGroup = require("../models/SetGroup");
const ExerciseSet = require("../models/ExerciseSet");
const asyncHandler = require("./asyncHandler");

exports.copyRoutineTemplate = asyncHandler(async (req, res, next) => {
  const {
    sourceRoutineId,
    user,
    destinationRoutineId,
    weekFilter,
    copyingFullRoutine,
  } = req.body;

  if (!weekFilter && !copyingFullRoutine) {
    return res.status(400).json({
      success: false,
      message:
        "You did not provide a weekFilter in the body of the request. If you are intending to copy all resources for a given week, pass '{}' as the filter",
    });
  }

  // collect all the bulkwrite results from weeks, set_groups and exercise_sets
  const bulkWriteResultsData = [];

  const NewWeeks = await Week.find({
    ...weekFilter,
    routine: destinationRoutineId,
  });

  if (!NewWeeks.length)
    return res.status(500).json({
      success: false,
      message: `Error bulkwriting new weeks from new routine with id: ${destinationRoutineId}`,
    });

  const oldToNewWeekIds = {};
  NewWeeks.forEach((new_week) => {
    new_week = new_week.toObject();
    oldToNewWeekIds[new_week.copied_from] = new_week._id;
  });

  /* ============ Find Source Set Groups ========================== */
  const SourceSetGroups = await SetGroup.find({
    routine: sourceRoutineId,
  });
  const setGroupBulkWrites = [];

  const sourceWeekIds = Object.keys(oldToNewWeekIds)
  SourceSetGroups.forEach((sourceSetGroup) => {
    sourceSetGroup = sourceSetGroup.toObject();
    if(sourceWeekIds.includes(sourceSetGroup.week)){

      const newSetGroup = {
        ...sourceSetGroup,
        user,
        week: oldToNewWeekIds[sourceSetGroup.week],
        routine: destinationRoutineId,
        day_number: parseInt(sourceSetGroup.day_number),
        week_number: parseInt(sourceSetGroup.week_number),
        copied_from: sourceSetGroup._id,
      }; // week = the _id of the week to which the set_group belongs
  
      delete newSetGroup._id;
      delete newSetGroup.id;
      delete newSetGroup.createdAt;
      delete newSetGroup.updatedAt;
      delete newSetGroup.__v;
  
      if (
        Number.isNaN(newSetGroup.week_number) !== true &&
        Number.isNaN(newSetGroup.day_number) !== true &&
        newSetGroup.day_number > 0 &&
        newSetGroup.week
      ) {
        setGroupBulkWrites.push({
          insertOne: {
            document: newSetGroup,
          },
        });
      }
    }
    
  });

  if (!setGroupBulkWrites.length) {
    if (req.query.send_bulkwrite_data) {
      delete req.query.send_bulkwrite_data; // deleting this from query
      res.bulkWriteResultsData = bulkWriteResultsData;
    }
    return next();
  }

  await SetGroup.bulkWrite(setGroupBulkWrites)
    .then((result) => bulkWriteResultsData.push({ set_groups: result }))
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: `Something went wrong trying to bulk write set_groups for routine id: ${destinationRoutineId}`,
        error,
      });
    });

  const NewSetGroups = await SetGroup.find({ routine: destinationRoutineId });

  if (!NewSetGroups.length)
    return res.status(500).json({
      success: false,
      message: `Error bulkwriting new set_groups for new routine with id: ${destinationRoutineId}`,
    });

  const oldToNewSetGroupAndWeekIds = {};
  NewSetGroups.forEach((new_set_group) => {
    new_set_group = new_set_group.toObject();
    oldToNewSetGroupAndWeekIds[new_set_group.copied_from] = {
      set_group: new_set_group._id,
      week: new_set_group.week,
    };
  });

  /* ============== Copy Exercise Sets ============================ */
  const RoutineTemplateExerciseSets = await ExerciseSet.find({
    routine: sourceRoutineId,
  });

  const exerciseSetsBulkWrites = [];

  RoutineTemplateExerciseSets.forEach((oldExerciseSet) => {
    oldExerciseSet = oldExerciseSet.toObject();

    const week = oldToNewSetGroupAndWeekIds[oldExerciseSet.set_group]
      ? oldToNewSetGroupAndWeekIds[oldExerciseSet.set_group]["week"]
      : "";
    const set_group = oldToNewSetGroupAndWeekIds[oldExerciseSet.set_group]
      ? oldToNewSetGroupAndWeekIds[oldExerciseSet.set_group]["set_group"]
      : "";

    const newExerciseSet = {
      ...oldExerciseSet,
      user,
      routine: destinationRoutineId,
      week, // week/set_group = the _id of the week/set_group to which the oldExerciseSet belongs
      set_group,
      copied_from: oldExerciseSet._id,
    };

    delete newExerciseSet._id;
    delete newExerciseSet.id;
    delete newExerciseSet.createdAt;
    delete newExerciseSet.updatedAt;
    delete newExerciseSet.__v;

    if (newExerciseSet.week && newExerciseSet.set_group) {
      exerciseSetsBulkWrites.push({
        insertOne: {
          document: newExerciseSet,
        },
      });
    }
  });

  if (!exerciseSetsBulkWrites.length) {
    if (req.query.send_bulkwrite_data) {
      delete req.query.send_bulkwrite_data;
      res.bulkWriteResultsData = bulkWriteResultsData;
    }
    return next();
  }

  await ExerciseSet.bulkWrite(exerciseSetsBulkWrites)
    .then((result) => bulkWriteResultsData.push({ exercise_sets: result }))
    .catch((error) => {
      // We don't want to have a new routine created if there's a problem copying the other resources from that routine.
      // We need to check if the operations is actually for creating a new routine from a template, or just copying week/s for an existing routine
      // If the destinationRoutineId is the same as sourceRoutineId, then the routine is not being created. An existing routine's weeks are being copied.
      if (destinationRoutineId !== sourceRoutineId) {
        Routine.deleteOne({ _id: destinationRoutineId }).then((result) => {
          return res.status(500).json({
            success: false,
            message: `Something went wrong trying to bulk write exercise_sets for new routine id: ${destinationRoutineId}. Aborting copy routine.`,
            error,
            deleted: result,
          });
        });
      }

      return res.status(500).json({
        success: false,
        message: `Something went wrong trying to bulk write exercise_sets for routine id: ${destinationRoutineId}`,
        error,
      });
    });

  if (req.query.send_bulkwrite_data) {
    delete req.query.send_bulkwrite_data;
    res.bulkWriteResultsData = bulkWriteResultsData;
  }

  return next();
}); /* END */
