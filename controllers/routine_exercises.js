const RoutineExercise = require('../models/RoutineExercise')
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new exercise for a routine (differen from exercise) - required fields: exercise, routine and user ids
// @route   POST /api/v1.0/routine-exercise
// @access  Private
exports.createRoutineExercise = asyncHandler(async (req, res, next) => {

  const routineExercise = new RoutineExercise(req.body)

  routineExercise.save((err, routineExercise) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    res.status(201).send({ success: true, data: routineExercise });
  })
  
});

// @desc    Get all routine excercises
// @route   GET /api/v1.0/routine-exercises
// @access  Private
exports.getAllRoutineExercises = asyncHandler(async (req, res, next) => {

  RoutineExercise
  .find()
  .populate({
    path: 'exercise',
    select: 'name category difficulty body_part muscle_group description'
  })
  .exec((err, routineExercises) => {

    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    res.status(201).send({ success: true, data: routineExercises })
  })
});