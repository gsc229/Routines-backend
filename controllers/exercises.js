const Exercise = require("../models/Exercise.js");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new exercise
// @route   POST /api/v1.0/exercises
// @access  Private
exports.createExercise = asyncHandler(async (req, res) => {
  const { original_creator } = req.body;

  if (!original_creator) {
    return res.status(400).send({
      success: false,
      errorMessage: "Needs the id of the originial creator",
    });
  }

  const exercise = await new Exercise(req.body);

  exercise.save((err, newExercise) => {
    if (err) {
      return res
        .status(400)
        .send({
          success: false,
          error_message: err.message,
          error_name: err.name,
        });
    }

    res.status(201).send({ success: true, data: newExercise });
  });
});

// @desc    Get all excercises
// @route   GET /api/v1.0/exercises
// @access  Private
exports.getAllExercises = asyncHandler(async (req, res) => {
  res.status(200).send(res.advancedResults);
});

// @desc    Get exercise by ID
// @route   GET /api/v1.0/exercises/:exerciseId
// @access  Private
exports.getExerciseById = asyncHandler(async (req, res) => {
  res.status(200).send(res.advancedResults);
});

// @desc    Edit exercise
// @route   PUT /api/v1.0/exercises/:exerciseId
// @access  Private
exports.editExercise = asyncHandler(async (req, res) => {
  await Exercise.findByIdAndUpdate(
    req.params.exerciseId, // id
    req.body, // changes
    { new: true, runValidators: true }, // options

    (err, exercise) => {
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

      if (exercise) {
        return res.status(201).send({ success: true, data: exercise });
      }

      return res
        .status(400)
        .send({
          success: false,
          error_message: `No exercise found with id of ${req.params.exerciseId}`,
        });
    }
  ).select(req.query.select)
});

// @desc    Delete an excercise
// @route   DELTE /api/v1.0/exercises/:exerciseId
// @access  Private
exports.deleteExercises = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.exerciseId);

  if (!exercise) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: "No exercise found with that id",
      });
  }

  exercise.deleteOne((err, exercise) => {
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
        data: exercise,
        message: "Exercise was deleted!",
      });
  });
});
