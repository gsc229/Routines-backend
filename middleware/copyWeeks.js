const Week = require("../models/RoutineWeek");
const asyncHandler = require("./asyncHandler");

exports.copyWeeks = asyncHandler(async (req, res, next) => {
  const {
    sourceRoutineId,
    user,
    destinationRoutineId,
    copyingFullRoutine
  } = req.body;

  const query = req.query

  if (!query && !copyingFullRoutine) {
    return res.status(400).json({
      success: false,
      message:
        "You did not provide a query in the request. If you are intending to copy all resources for a given week, pass 'copy_all=true'  as the filter",
    });
  }

  // collect all the bulkwrite results from weeks, set_groups and exercise_sets
  const bulkWriteResultsData = [];

  /* ============ Copy Weeks ================================ */
  // Find source weeks
  const SourceWeeks = await Week.find({
    ...query,
    routine: sourceRoutineId,
  });

  const weekBulkWrites = [];

  SourceWeeks.forEach((oldWeek) => {
    oldWeek = oldWeek.toObject();
    const newWeek = {
      ...oldWeek,
      week_number: parseInt(oldWeek.week_number),
      copied_from: oldWeek._id,
      user,
      routine: destinationRoutineId,
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

  if (!weekBulkWrites.length) {
    if (req.query.send_bulkwrite_data) {
      delete req.query.send_bulkwrite_data;
      res.bulkWriteResultsData = bulkWriteResultsData;
    }
    return next();
  }

  await Week.bulkWrite(weekBulkWrites)
    .then((result) => bulkWriteResultsData.push({ weeks: result }))
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: `Something went wrong trying to bulk write weeks for routine id: ${destinationRoutineId}`,
        error,
      });
    });

  
  return next();
}); /* END */
