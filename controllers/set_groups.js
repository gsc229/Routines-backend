const Exercise = require('../models/Exercise')
const Routine = require('../models/Routine')
const Week = require('../models/RoutineWeek')
const SetGroup = require('../models/SetGroup')
const ExerciseSet = require('../models/ExerciseSet')
const asyncHandler = require("../middleware/asyncHandler")

/* ============================ Set Groups ================================================= */
/* ============================ Set Groups ================================================= */
/* ============================ Set Groups ================================================= */
/* ============================ Set Groups ================================================= */

// @desc    Create a new set group for a routine (differen from exercise) - required fields: exercise, routine, week and user ids
// @route   POST /api/v1.0/set-groups
// @access  Private
exports.createSetGroup = asyncHandler(async (req, res, next) => {

  const {exercise, routine, week, day, user} = req.body // day is the only one that's not an _id (UMTWRFS)

  if(!exercise || !routine || !week || !day || !user){
    return res.status(400).send({success: false, error_message: `Must provide exercise id, routine id, week id, user id and day (UMTWRFS)`})
  }

  // Check if exercise, routine and week exists
  const foundExercise = await Exercise.findById(exercise)

  if(!foundExercise){
    return res.status(400).send({success: false, error_message: `No exercise found with id of ${exercise}`})
  }

  const foundRoutine = await Routine.findById(routine)

  if(!foundRoutine){
    return res.status(400).send({success: false, error_message: `No routine found with id of ${routine}`})
  }

  const foundWeek = await Week.findById(week)

  if(!foundWeek){
    return res.status(400).send({success: false, error_message: `No week found with id of ${week}`})
  }

  const setGroup = await new SetGroup(req.body)

  setGroup.save((err, newSetGroup) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    res.status(201).send({ success: true, data: newSetGroup });
  })
  
});

// @desc    Get all set groups
// @route   GET /api/v1.0/set-groups
// @access  Private
exports.getAllSetGroups = asyncHandler(async (req, res, next) => {
  return res.status(200).send(res.advancedResults)
});

// @desc    Get a set group by ID
// @route   GET /api/v1.0/set-groups/:setGroupId
// @access  Private
exports.getSetGroupById = asyncHandler(async (req, res, next) => {
  return res.status(200).send(res.advancedResults)
});

// @desc    Edit an set group
// @route   PUT /api/v1.0/set-groups/:setGroupId
// @access  Private
exports.editSetGroup = asyncHandler(async (req, res, next) => {

  await SetGroup
  .findByIdAndUpdate(
    req.params.setGroupId , // id
    req.body, // changes
    {new: true, runValidators: true}, // options

    (err, routineEx) => { // callback

    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    if(routineEx){
      return res.status(201).send({ success: true, data: routineEx })
    }

    return res.status(400).send({success: false, error_message: `No set gruoup found with id of ${req.params.setGroupId}`})

  }).populate('exercise')

});

// @desc    Delete a routine excercises
// @route   DELTE /api/v1.0/set-groups/:setGroupId
// @access  Private
exports.deleteSetGroup = asyncHandler(async (req, res, next) => {
  const setGroup = await SetGroup.findById(req.params.setGroupId)

  if(!setGroup){
    return res.status(400).send({ success: false, error_message: 'No set group found with that id'})
  }

  setGroup.deleteOne()

  return res.status(200).json({ success: true, data: {} })

});





