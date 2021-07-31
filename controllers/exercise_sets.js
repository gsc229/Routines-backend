const Exercise = require("../models/Exercise");
const Routine = require("../models/Routine");
const Week = require("../models/RoutineWeek");
const SetGroup = require("../models/SetGroup");
const ExerciseSet = require("../models/ExerciseSet");
const asyncHandler = require("../middleware/asyncHandler");
const { response } = require("express");
/* ============================ Exercise Sets ================================================= */
/* ============================ Exercise Sets ================================================= */
/* ============================ Exercise Sets ================================================= */
/* ============================ Exercise Sets ================================================= */

// @desc    Create a new exercise set for a routine (differen from exercise) - required fields: exercise, routine, week and user ids
// @route   POST /api/v1.0/exercise-set
// @access  Private
exports.createExerciseSet = asyncHandler(async (req, res, next) => {
  const { exercise, routine, week, day, user, set_group } = req.body;

  // Check if exercise, routine and week exists
  const foundExercise = await Exercise.findById(exercise);

  if (!foundExercise) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: `No exercise found with id of ${exercise}`,
      });
  }

  const foundRoutine = await Routine.findById(routine);

  if (!foundRoutine) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: `No routine found with id of ${routine}`,
      });
  }

  const foundWeek = await Week.findById(week);

  if (!foundWeek) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: `No week found with id of ${week}`,
      });
  }

  const foundSetGroup = await SetGroup.findById(set_group);

  if (!foundSetGroup) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: `No set_group set found with id of ${set_group}`,
      });
  }

  const exerciseSet = await new ExerciseSet(req.body);

  exerciseSet.save((err, newExerciseSet) => {
    if (err) {
      return res
        .status(400)
        .send({
          success: false,
          error_message: err.message,
          error_name: err.name,
        });
    }

    res.status(201).send({ success: true, data: newExerciseSet });
  });
});

// @desc    Create a new exercise set for a routine (differen from exercise) - required fields: exercise, routine, week and user ids
// @route   POST /api/v1.0/exercise-set/create-many
// @access  Private
exports.createManyExerciseSets = asyncHandler(async (req, res, next) => {
  console.log("createManyExerciseSets req.body", req.body);

  const { routine, week, set_group } = req.body[0];

  console.log({ routine, week, set_group });

  // Check if exercise, routine and week exists
  /* const foundExercise = await Exercise.findById(exercise)

  if(!foundExercise){
    return res.status(400).send({success: false, error_message: `No exercise found with id of ${exercise}`})
  } */

  const foundRoutine = await Routine.findById(routine);

  if (!foundRoutine) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: `No routine found with id of ${routine}`,
      });
  }

  const foundWeek = await Week.findById(week);

  if (!foundWeek) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: `No week found with id of ${week}`,
      });
  }

  const foundSetGroup = await SetGroup.findById(set_group);

  if (!foundSetGroup) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: `No set_group found with id of ${set_group}`,
      });
  }

  // INSERT MANY
  const newSets = await ExerciseSet.insertMany(req.body);

  console.log(JSON.stringify({ newSets }, "", 2).bgYellow);

  if (newSets) {
    const newSetsPopulateExercise = await ExerciseSet.find({
      set_group,
    }).populate("exercise");
    if (newSetsPopulateExercise) {
      return res
        .status(201)
        .send({ success: true, data: newSetsPopulateExercise });
    }
  }

  return res
    .status(400)
    .send({
      success: false,
      error_message: error.message,
      error_name: error.name,
    });
});

// @desc    Get all exercise sets
// @route   GET /api/v1.0/set-groups/exercises-sets
// @access  Private
exports.getAllExerciseSets = asyncHandler(async (req, res, next) => {
  return res.status(200).send(res.advancedResults);
});

// @desc    Get a exercise set by ID
// @route   GET /api/v1.0/set-groups/exercises-sets/:exerciseSetId
// @access  Private
exports.getExerciseSetById = asyncHandler(async (req, res, next) => {
  return res.status(200).send(res.advancedResults);
});

// @desc    Edit a exercise set by ID
// @route   PUT /api/v1.0/exercise-sets/:exerciseSetId
// @access  Private
exports.editExerciseSet = asyncHandler(async (req, res, next) => {
  console.log("editExerciseSet".bgMagenta);
  await ExerciseSet.findByIdAndUpdate(
    req.params.exerciseSetId, // id
    req.body, // changes
    { new: true, runValidators: true }, // options

    (err, routineEx) => {
      // callback
      if (err) {
        return res
          .status(400)
          .send({
            success: false,
            error_message: err.message,
            error_name: err.name,
          });
      }

      if (routineEx) {
        return res.status(201).send({ success: true, data: routineEx });
      }

      return res
        .status(400)
        .send({
          success: false,
          error_message: `No exercise set found with id of ${req.params.exerciseSetId}`,
        });
    }
  ).populate("exercise");
});

// @desc    Edit multiple exercise sets by IDs [{update: {filter: {_id: _id}, update: {some_key: 'some value' } } }, ...{..}]
// @route   PUT /api/v1.0/exercise-sets/bulk-edit
// @access  Private
exports.bulkWriteExerciseSets = asyncHandler(async (req, res, next) => {
  console.log(JSON.stringify(req.body, "", 2).bgRed);

  const { updatesArray, findByObj } = req.body; // findBy === {set_group: setGroupId} || {week: weekId} || {routine: rotuineId}

  console.log(
    "exercise_sets controller",
    JSON.stringify({ updatesArray, findByObj }, "", 2).red
  );

  await ExerciseSet.bulkWrite(updatesArray, async (err, bulkWriteResults) => {
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
      const newSetsPopulateExercise = await ExerciseSet.find(
        findByObj
      ).populate("exercise");
      if (newSetsPopulateExercise) {
        return res
          .status(201)
          .send({
            success: true,
            data: newSetsPopulateExercise,
            bulkWriteResults,
          });
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

// @desc    Delete a routine excercises
// @route   DELTE /api/v1.0/set-groups/exercises-sets/:exerciseSetId
// @access  Private
exports.deleteExerciseSets = asyncHandler(async (req, res, next) => {
  const exerciseSet = await ExerciseSet.findById(req.params.exerciseSetId);

  if (!exerciseSet) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: "No exercise set found with that id",
      });
  }

  exerciseSet.deleteOne((err, exerciseSet) => {
    if (err) {
      return res
        .status(400)
        .send({
          success: false,
          error_message: err.message,
          error_name: err.name,
        });
    }
    return res
      .status(201)
      .send({
        success: true,
        data: exerciseSet,
        message: "Exercise set was deleted!",
      });
  });
});
