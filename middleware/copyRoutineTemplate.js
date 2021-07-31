const Routine = require("../models/Routine");
const Week = require("../models/RoutineWeek");
const SetGroup = require("../models/SetGroup");
const ExerciseSet = require("../models/ExerciseSet");
const asyncHandler = require("./asyncHandler");

exports.validateCopyRoutineBody = asyncHandler(async (req, res, next) => {
  const template_id = req.template_id;
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

  next();
});

exports.copyRoutineTemplate = asyncHandler(async (req, res, next) => {
  const { template_id, user, start_date } = req.body;

  const RoutineTemplate = await Routine.findById(template_id)
    .populate("weeks")
    .populate("set_groups")
    .populate("exercise_sets");


  /* ======================== Copy Routine (top-level info) =================== */

  const routineInfoCopy = {
    ...RoutineTemplate,
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
  delete routineInfoCopy.weeks;
  delete routineInfoCopy.set_groups;
  delete routineInfoCopy.exercise_sets;
  delete routineInfoCopy.__v;

  const NewRoutine = await new Routine(routineInfoCopy).save();

  if (!NewRoutine)
    res.status(500).json({
      success: false,
      message: `Something went wrong creating routine from template_id: ${template_id}`,
    });

  // attach routineId to req.body for the next middlware upDateRoutineDates:
  req.body.routineId = NewRoutine._id

  const bulkWriteResultsData = [];

  /* ============ Copy Weeks ================================ */
  const weekBulkWrites = [];

  RoutineTemplate.weeks.forEach((week) => {
    const { id } = week;

    const week_number = parseInt(week.week_number);
    delete week._id;
    delete week.id;
    delete week.createdAt;
    delete week.updatedAt;
    delete week.__v;

    if (Number.isNaN(week_number) !== true && week_number > 0) {
      weekBulkWrites.push({
        insertOne: {
          document: {
            ...week,
            routine: NewRoutine._id,
            copied_from: id,
          },
        },
      });
    }
  });

  Week.bulkWrite(weekBulkWrites)
    .then((result) => bulkWriteResultsData.push({ weeks: result }))
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: `Something went wrong trying to bulk write weeks for routine id: ${NewRoutine._id}`,
        error,
      })
    );

  const NewWeeks = await Week.find({ routine: NewRoutine._id });

  if (!NewWeeks)
    res.status(500).json({
      success: false,
      message: `Error bulkwriting new weeks from new routine with id: ${NewRoutine._id}`,
    });
  
  

  const oldToNewWeekIds = {};
  NewWeeks.forEach((week) => (oldToNewWeekIds[week.copied_from] = week.id));

  /* ============ Copy Set Groups ========================== */
  const setGroupBulkWrites = [];

  RoutineTemplate.set_groups.forEach((set_group) => {
    const { id, week } = set_group; // week = the _id of the week to which the set_group belongs
    const day_number = parseInt(set_group.day_number);
    const week_number = parseInt(set_group.week_number);

    delete set_group._id;
    delete set_group.id;
    delete set_group.createdAt;
    delete set_group.updatedAt;
    delete set_group.__v;

    if (
      Number.isNaN(week_number) !== true &&
      Number.isNaN(day_number) !== true &&
      day_number > 0
    ) {
      setGroupBulkWrites.push({
        insertOne: {
          document: {
            ...set_group,
            routine: NewRoutine._id,
            week: oldToNewWeekIds[week],
            copied_from: id,
          },
        },
      });
    }
  });

  SetGroup.bulkWrite(setGroupBulkWrites)
    .then((result) => bulkWriteResultsData.push({ set_groups: result }))
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: `Something went wrong trying to bulk write set_groups for routine id: ${NewRoutine._id}`,
        error,
      })
    );

  const NewSetGroups = await SetGroup.find({ routine: NewRoutine._id });

  if (!NewSetGroups)
    res.status(500).json({
      success: false,
      message: `Error bulkwriting new set_groups for new routine with id: ${NewRoutine._id}`,
    });

  const oldToNewSetGroupIds = {};
  NewSetGroups.forEach(
    (set_group) => (oldToNewSetGroupIds[set_group.copied_from] = set_group.id)
  );

  /* ============== Copy Exercise Sets ============================ */
  const exerciseSetsBulkWrites = [];

  RoutineTemplate.exercise_sets.forEach((exercise_set) => {
    const { id, week, set_group } = exercise_set; // week/set_group = the _id of the week/set_group to which the exercise_set belongs
    const day_number = parseInt(exercise_set.day_number);
    const week_number = parseInt(exercise_set.week_number);

    delete exercise_set._id;
    delete exercise_set.id;
    delete exercise_set.createdAt;
    delete exercise_set.updatedAt;
    delete exercise_set.__v;

    if (
      Number.isNaN(week_number) !== true &&
      Number.isNaN(day_number) !== true &&
      day_number > 0
    ) {
      exerciseSetsBulkWrites.push({
        insertOne: {
          document: {
            ...exercise_set,
            routine: NewRoutine._id,
            week: oldToNewWeekIds[week],
            set_group: oldToNewSetGroupIds[set_group],
            copied_from: id,
          },
        },
      });
    }
  });

  ExerciseSet.bulkWrite(exerciseSetsBulkWrites)
    .then((result) => bulkWriteResultsData.push({ exercise_sets: result }))
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: `Something went wrong trying to bulk write exercise_sets for routine id: ${NewRoutine._id}`,
        error,
      })
    );

  next();
}); /* END */
