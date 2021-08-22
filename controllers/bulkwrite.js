const Routine = require("../models/Routine");
const Week = require("../models/RoutineWeek");
const SetGroup = require("../models/SetGroup");
const ExerciseSet = require("../models/ExerciseSet")
const advancedQuery = require("../middleware/advancedQuery")
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Edit multiple resources by IDs [{update: {filter: {_id: _id}, update: {some_key: 'some value' } } }, ...{..}]
// @route   PUT /api/v1.0/bulkwrite
// @access  Private
exports.bulkWrite = asyncHandler(async (req, res) => {
  console.log(JSON.stringify(req.body, "", 2).bgRed);
  const { updatesArray, findByObj } = req.body; // findBy === {week: weekId} || {routine: rotuineId}
  /* 
    updatesArray: [
      routines: [{update: {filter: {_id: _id}, update: {some_key: 'some value' } } }, ...{..}],
      weeks: [{update: {filter: {_id: _id}, update: {some_key: 'some value' } } }, ...{..}],
      set_groups: [
        [{update: {filter: {_id: _id}, update: {some_key: 'some value' } } }, ...{..}]
      ],
      exercise_sets: [{update: {filter: {_id: _id}, update: {some_key: 'some value' } } }, ...{..}]
    ]
  
  */
  console.log(
    "set_group controller",
    JSON.stringify({ updatesArray, findByObj }, "", 2).red
  );

  await SetGroup.bulkWrite(updatesArray, async (err, bulkWriteResults) => {
    if (err) {
      return res
        .status(400)
        .send({
          success: false,
          error_message: err.message,
          error_name: err.name,
        });
    }

    if (bulkWriteResults) {
      const updatedSetGroups = await SetGroup.find(findByObj);
      if (updatedSetGroups) {
        return res
          .status(201)
          .send({ success: true, data: updatedSetGroups, bulkWriteResults });
      }
    }

    return res
      .status(500)
      .send({
        success: false,
        error_message: `Somthing went wrong with the bulkwrite`,
      });
  });
});

// @desc    If there's a query on the above bulkwrite contorller, the controller will route the query to the advanced middlware with 
//          the appropriate Model
// @route   PUT /api/v1.0/bulkwrite
// @access  Private
exports.afterWriteQuery = asyncHandler(async (req, res) => {
  return res.status(200).send(res.advancedResults);
});




