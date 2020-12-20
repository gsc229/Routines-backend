const Exercise = require('../models/Exercise')
const Routine = require('../models/Routine')
const Week = require('../models/RoutineWeek')
const ExerciseSet = require('../models/ExerciseSet')
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Create a new exercise for a routine (differen from exercise) - required fields: exercise, routine and user ids
// @route   POST /api/v1.0/routine-exercise
// @access  Private
exports.createExerciseSet = asyncHandler(async (req, res, next) => {

  const {exercise, routine, week, day, user} = req.body

  if(!exercise || !routine || !week || !day || !user){
    return res.status(400).send({success: false, error_message: `Must provide exercise id, routine id, week id, user id and day (UMTWRFS)`})
  }

  // Check if exercise, routine and week exists
  const foundExercise = await Exercise.findById(exercise)
  const foundRoutine = await Routine.findById(routine)
  const foundWeek = await Week.findById(week)

  if(!foundExercise){
    return res.status(400).send({success: false, error_message: `No exercise found with id of ${exercise}`})
  }

  if(!foundRoutine){
    return res.status(400).send({success: false, error_message: `No routine found with id of ${routine}`})
  }

  if(!foundWeek){
    return res.status(400).send({success: false, error_message: `No week found with id of ${week}`})
  }

  const exerciseSet = new ExerciseSet(req.body)

  exerciseSet.save((err, exerciseSet) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    res.status(201).send({ success: true, data: exerciseSet });
  })
  
});

// @desc    Get all routine excercises
// @route   GET /api/v1.0/exercises-sets
// @access  Private
exports.getAllExerciseSets = asyncHandler(async (req, res, next) => {

  res.status(200).send(res.advancedResults)
  
});

// @desc    Get a routine exercise by ID
// @route   GET /api/v1.0/exercises-sets/:routineExId
// @access  Private
exports.getExerciseSetById = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults)
  
});

// @desc    Edit a routine-exercise by ID
// @route   PUT /api/v1.0/routine-exercise/:routineExId
// @access  Private
exports.editExerciseSet = asyncHandler(async (req, res, next) => {

  await ExerciseSet
  .findByIdAndUpdate(
    req.params.routineExId , // id
    req.body, // changes
    {new: true, runValidators: true}, // options

    (err, routineEx) => { // callback

    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    if(routineEx){
      return res.status(201).send({ success: true, data: routineEx })
    }

    return res.status(400).send({success: false, error_message: `No exercise set found with id of ${req.params.routineExId}`})

  }).populate('exercise')

});

// @desc    Delete a routine excercises
// @route   DELTE /api/v1.0/exercises-sets/:routineExId
// @access  Private
exports.deleteExerciseSets = asyncHandler(async (req, res, next) => {
  const exerciseSet = await ExerciseSet.findById(req.params.routineExId)

  if(!exerciseSet){
    return res.status(400).send({ success: false, error_message: 'No routine exercise found with that id'})
  }

  exerciseSet.deleteOne()

  return res.status(200).json({ success: true, data: {} })

});


