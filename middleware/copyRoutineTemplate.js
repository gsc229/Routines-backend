const Routine = require("../models/Routine");
const Week = require("../models/RoutineWeek");
const SetGroup = require("../models/SetGroup");
const ExerciseSet = require("../models/ExerciseSet");
const asyncHandler = require("./asyncHandler");
const dayjs = require("dayjs");

exports.validateCopyRoutineBody = asyncHandler(async (req, res, next) => {
  const template_id = req.body.template_id;
  const user = req.body.user;
  const start_date = req.body.start_date;

  if (!template_id)
    res.status(400).json({
      success: false,
      message: "You did not include a template_id in the request body",
    });
  if (!user)
    res.status(400).json({
      success: false,
      message: "You did not include a user (user id) in the request body",
    });
  if (!start_date)
    res.status(400).json({
      success: false,
      message: "You did not include a start_date in the request body",
    });

  if (!dayjs(start_date).isValid())
    res.status(400).json({
      success: false,
      message: `${start_date} is not a valid start_date`,
    });

  next();
});

exports.copyRoutineTemplate = asyncHandler(async (req, res, next) => {
  const { template_id, user, start_date } = req.body;

  let RoutineTemplate = await Routine.findById(template_id);

  if (!RoutineTemplate)
    return res.status(500).json({
      success: false,
      message: `There's no routine template with id of ${template_id}`,
    });

  /* ======================== Copy Routine (top-level info) =================== */
  const routineInfoCopy = {
    ...RoutineTemplate.toObject(),
    is_template: false,
    template_id,
    copied_from: template_id,
    user,
    start_date,
  };

  delete routineInfoCopy._id;
  delete routineInfoCopy.id;
  delete routineInfoCopy.createdAt;
  delete routineInfoCopy.updatedAt;
  delete routineInfoCopy.__v;

  let NewRoutine = await new Routine(routineInfoCopy).save();

  if (!NewRoutine)
    return res.status(500).json({
      success: false,
      message: `Something went wrong creating routine from template_id: ${template_id}`,
    });

  NewRoutine = NewRoutine.toObject();
  

  // attach routineId to req.body for the next middlware upDateRoutineDates:
  req.body.routineId = NewRoutine.id;
  // collect all the bulkwrite results from weeks, set_groups and exercise_sets
  const bulkWriteResultsData = [];

  /* ============ Copy Weeks ================================ */
  const RoutineTemplateWeeks = await Week.find({ routine: template_id });

  const weekBulkWrites = [];

  RoutineTemplateWeeks.forEach((oldWeek) => {
    oldWeek = oldWeek.toObject();
    const newWeek = {
      ...oldWeek,
      week_number: parseInt(oldWeek.week_number),
      copied_from: oldWeek._id,
      user,
      routine: NewRoutine._id,
    };

    delete newWeek._id;
    delete newWeek.id;
    delete newWeek.createdAt;
    delete newWeek.updatedAt;
    delete newWeek.__v;

    if (Number.isNaN(newWeek.week_number) !== true && newWeek.week_number > 0) {
      weekBulkWrites.push({
        insertOne: {
          document: newWeek,
        },
      });
    }
  });
  
  const oldToNewWeekIds = {};

  if (weekBulkWrites.length) {
    await Week.bulkWrite(weekBulkWrites)
      .then((result) => bulkWriteResultsData.push({ weeks: result }))
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: `Something went wrong trying to bulk write weeks for routine id: ${NewRoutine._id}`,
          error,
        });
      });

    const NewWeeks = await Week.find({ routine: NewRoutine._id });

    

    if (!NewWeeks.length)
      return res.status(500).json({
        success: false,
        message: `Error bulkwriting new weeks from new routine with id: ${NewRoutine._id}`,
      });

    NewWeeks.forEach((new_week) => {
      new_week = new_week.toObject();
      oldToNewWeekIds[new_week.copied_from] = new_week._id;
    });

    
  }

  /* ============ Copy Set Groups ========================== */
  const RoutineTemplateSetGroups = await SetGroup.find({
    routine: template_id,
  });
  const setGroupBulkWrites = [];

  RoutineTemplateSetGroups.forEach((oldSetGroup) => {
    oldSetGroup = oldSetGroup.toObject();
    const newSetGroup = {
      ...oldSetGroup,
      user,
      week: oldToNewWeekIds[oldSetGroup.week],
      routine: NewRoutine._id,
      day_number: parseInt(oldSetGroup.day_number),
      week_number: parseInt(oldSetGroup.week_number),
      copied_from: oldSetGroup._id,
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
  });
  
  const oldToNewSetGroupIds = {};

  if (setGroupBulkWrites.length) {
    await SetGroup.bulkWrite(setGroupBulkWrites)
      .then((result) => bulkWriteResultsData.push({ set_groups: result }))
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: `Something went wrong trying to bulk write set_groups for routine id: ${NewRoutine._id}`,
          error,
        });
      });

    const NewSetGroups = await SetGroup.find({ routine: NewRoutine._id });
    
    if (!NewSetGroups.length)
      return res.status(500).json({
        success: false,
        message: `Error bulkwriting new set_groups for new routine with id: ${NewRoutine._id}`,
      });

    NewSetGroups.forEach((new_set_group) => {
      new_set_group = new_set_group.toObject();
      oldToNewSetGroupIds[new_set_group.copied_from] = new_set_group._id;
    });
  }

  /* ============== Copy Exercise Sets ============================ */
  const RoutineTemplateExerciseSets = await ExerciseSet.find({
    routine: template_id,
  });

  const exerciseSetsBulkWrites = [];

  RoutineTemplateExerciseSets.forEach((oldExerciseSet) => {
    oldExerciseSet = oldExerciseSet.toObject();
    const newExerciseSet = {
      ...oldExerciseSet,
      day_number: parseInt(oldExerciseSet.day_number),
      week_number: parseInt(oldExerciseSet.week_number),
      user,
      routine: NewRoutine._id,
      week: oldToNewWeekIds[oldExerciseSet.week], // week/set_group = the _id of the week/set_group to which the oldExerciseSet belongs
      set_group: oldToNewSetGroupIds[oldExerciseSet.set_group],
      copied_from: oldExerciseSet._id,
    };

    delete newExerciseSet._id;
    delete newExerciseSet.id;
    delete newExerciseSet.createdAt;
    delete newExerciseSet.updatedAt;
    delete newExerciseSet.__v;

    if (
      Number.isNaN(newExerciseSet.week_number) !== true &&
      Number.isNaN(newExerciseSet.day_number) !== true &&
      newExerciseSet.day_number > 0 &&
      newExerciseSet.week &&
      newExerciseSet.set_group
    ) {
      exerciseSetsBulkWrites.push({
        insertOne: {
          document: newExerciseSet,
        },
      });
    }
  });

  if (exerciseSetsBulkWrites.length) {
    
    await ExerciseSet.bulkWrite(exerciseSetsBulkWrites)
      .then((result) => bulkWriteResultsData.push({ exercise_sets: result }))
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: `Something went wrong trying to bulk write exercise_sets for routine id: ${NewRoutine._id}`,
          error,
        });
      });

    if (req.query.send_bulkwrite_data) {
      delete req.query.send_bulkwrite_data;
      res.bulkWriteResultsData = bulkWriteResultsData;
    }
  }

  next();
}); /* END */
