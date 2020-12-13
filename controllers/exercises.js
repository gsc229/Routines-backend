const Exercise = require("../models/Exercise.js");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

/* 
Exercise Properies:
    name,
    category,
    difficulty,
    description,
    original_creator, // required
    bodyPart,
    muscle_group,
    target_muscle,
    equipment,
    video_url 

*/

// @desc    Create a new exercise
// @route   POST /api/v1.0/exercises
// @access  Private
exports.createExercise = asyncHandler(async (req, res, next) => {
  const { original_creator } = req.body;

  if (!original_creator) {
    return res.status(400).send({
      success: false,
      errorMessage: "Needs the id of the originial creator",
    });
  }

  const exercise = await Exercise.create(req.body);

  if (!exercise) {
    return next(
      new ErrorResponse("There was a problem creating the exercise", 500)
    );
  }

  res.status(201).send({ success: true, data: exercise });
});

// @desc    Get all excercises
// @route   GET /api/v1.0/exercises
// @access  Private
exports.getAllExercises = asyncHandler(async (req, res, next) => {

  Exercise.find().exec((err, exercises) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    res.status(201).send({ success: true, data: exercises })
    
  })
  
});