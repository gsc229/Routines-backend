const Routine = require("../models/Routine");
const Week = require("../models/RoutineWeek");
const SetGroup = require("../models/SetGroup");
const ExerciseSet = require("../models/ExerciseSet");
const asyncHandler = require("../middleware/asyncHandler");
const dayjs = require("dayjs");
//console.log(dayjs('2021-08-22T00:00:00.000Z').diff(dayjs("2021-07-05T00:00:00.000Z"), 'days'))
//console.log(`${Number.isNaN(parseInt("pie"))}`.red)
/* @desc
In the body of the request provide week_number

Checks to see if there is a week with the same week_number. 
If there is, all weeks on or after that week_number will be moved one week later in week_number.
week_start_dates will be adjusted according to their new week_number. 
All set_groups and exercise_sets will be moved one week past their scheduled_date
*/
// @route   PUT /routine/weeks/update-week-dates/:weekId
// @access  Private
exports.updateWeekDates = asyncHandler(async (req, res, next) => {
  const weekId = req.params.weekId;
  const newWeekNumber = parseInt(req.body.week_number); // week numbers are NOT zero indexed, they start at 1

  if (!newWeekNumber || Number.isNaN(newWeekNumber))
    return res.status(400).json({
      success: false,
      message: `You did not provide a ${
        !newWeekNumber ? "" : "valid"
      } week_number.`,
    });

  const week = await Week.findById(weekId);

  if (!week)
    return res
      .status(404)
      .json({ success: false, message: `No week with id: ${weekId}` });

  if(week.week_number === newWeekNumber){
    return res
      .satus(400)
      .json({ success: false, message: `The week_number on file (${week.week_number}) is the same as the week_number provided`})
  }

  const routineId = week.routine
  req.params.routineId = routine
  // deleting the weekId from params so that the advancedQuery middleware will be sure to pick up only the routineId
  delete req.params.weekId

  const routine = await Routine.findById(routineId)
    .populate("weeks")
    .populate("set_groups")
    .populate("exercise_sets");

  if (!routine)
    return res
      .status(400)
      .json({ success: false, message: `No routine with id: ${routineId}` });

  const routineStartDate = dayjs(routine.start_date);

  const bulkWriteResultsData = [];

  const weekBulkWrites = [];
  const weekIdToNumberAndStartDate = {};

  routine.weeks.forEach((week) => {
    const { _id } = week;

    let week_number = parseInt(week.week_number);

    if (
      Number.isNaN(week_number) !== true &&
      parseInt(week_number) >= newWeekNumber
    ) {
      week_number =
        _id === week._id ? newWeekNumber : parseInt(week_number) + 1;

      const week_start_date = routineStartDate
        .add(week_number - 1, "week") // original dates of all week numbers were added as week_number - 1. To move old weeks forward in time one week just use the week number as it was saved orignially.
        .toISOString();

      weekBulkWrites.push({
        updateOne: {
          filter: { _id },
          update: { week_start_date, week_number },
        },
      });

      weekIdToNumberAndStartDate[_id] = { week_number, week_start_date };
    }
  });

  Week.bulkWrite(weekBulkWrites)
    .then((result) => bulkWriteResultsData.push({ weeks: result }))
    .catch((error) =>
      res.satus(500).json({
        success: false,
        message: "Something went wrong trying to bulk write weeks.",
        error,
      })
    );

  /* ========= set_groups =========== */
  const setGroupBulkWrites = [];
  const setGroupIdToUpdateObject = {};

  routine.set_groups.forEach((set_group) => {
    const { _id } = set_group; // week = the _id of the week to which the set_group belongs

    const day_number = parseInt(set_group.day_number);
    const week_number = parseInt(set_group.week_number);

    if (
      Number.isNaN(week_number) !== true &&
      Number.isNaN(day_number) !== true &&
      day_number > 0
    ) {
      const update = {};

      update["scheduled_date"] = dayjs(
        weekIdToNumberAndStartDate[week]["week_start_date"]
      )
        .add(day_number - 1, "day")
        .toISOString();

      update["week_number"] = weekIdToNumberAndStartDate[week]["week_number"];

      // cache the updates to use again for the exercise_set bulkwirtes --> they are more numerous, but are exactly the same updates as the set_groups
      setGroupIdToUpdateObject[_id] = update;

      setGroupBulkWrites.push({ updateOne: { filter: { _id }, update } });
    }
  });

  SetGroup.bulkWrite(setGroupBulkWrites)
    .then((result) => bulkWriteResultsData.push({ set_groups: result }))
    .catch((error) =>
      res.satus(500).json({
        success: false,
        message: "Something went wrong trying to bulk write set_groups.",
        error,
      })
    );

  /* ========== exercise_sets ============= */

  const exerciseSetBulkWrites = [];

  routine.exercise_sets.forEach((set) => {
    const { _id, set_group } = set; // set_group = the id of the set_group to which the exercise_set belongs
    // the updates should match the updates of the set_group
    exerciseSetBulkWrites.push({
      updateOne: {
        filter: { _id },
        update: setGroupIdToUpdateObject[set_group],
      },
    });
  });

  ExerciseSet.bulkWrite(exerciseSetBulkWrites)
    .then((result) => bulkWriteResultsData.push({ exercise_sets: result }))
    .catch((error) =>
      res.satus(500).json({
        success: false,
        message: "Something went wrong trying to bulk write exercise_sets.",
        error,
      })
    );
  
  req.body.bulkWriteResultsData = bulkWriteResultsData

  next()

});
