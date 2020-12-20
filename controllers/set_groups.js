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


/* ============================ Exercise Sets ================================================= */
/* ============================ Exercise Sets ================================================= */
/* ============================ Exercise Sets ================================================= */
/* ============================ Exercise Sets ================================================= */

// @desc    Create a new exercise set for a routine (differen from exercise) - required fields: exercise, routine, week and user ids
// @route   POST /api/v1.0/exercise-set
// @access  Private
exports.createExerciseSet = asyncHandler(async (req, res, next) => {

  const {exercise, routine, week, day, user, set_group} = req.body

  if(!exercise || !routine || !week || !day || !set_group || !user){
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

  const foundSetGroup = await SetGroup.findById(set_group)

  if(!foundSetGroup){
    return res.status(400).send({success: false, error_message: `No set_group set found with id of ${set_group}`})
  }

  const exerciseSet = await new ExerciseSet(req.body)

  exerciseSet.save((err, newExerciseSet) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    res.status(201).send({ success: true, data: newExerciseSet });
  })
  
});

// @desc    Get all exercise sets
// @route   GET /api/v1.0/set-groups/exercises-sets
// @access  Private
exports.getAllExerciseSets = asyncHandler(async (req, res, next) => {

  res.status(200).send(res.advancedResults)
  
});

// @desc    Get a exercise set by ID
// @route   GET /api/v1.0/set-groups/exercises-sets/:exerciseSetId
// @access  Private
exports.getExerciseSetById = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults)
  
});

// @desc    Edit a exercise set by ID
// @route   PUT /api/v1.0/set-groups/exercise-sets/:exerciseSetId
// @access  Private
exports.editExerciseSet = asyncHandler(async (req, res, next) => {

  await ExerciseSet
  .findByIdAndUpdate(
    req.params.exerciseSetId , // id
    req.body, // changes
    {new: true, runValidators: true}, // options

    (err, routineEx) => { // callback

    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    if(routineEx){
      return res.status(201).send({ success: true, data: routineEx })
    }

    return res.status(400).send({success: false, error_message: `No exercise set found with id of ${req.params.exerciseSetId}`})

  }).populate('exercise')

});

// @desc    Delete a routine excercises
// @route   DELTE /api/v1.0/set-groups/exercises-sets/:exerciseSetId
// @access  Private
exports.deleteExerciseSets = asyncHandler(async (req, res, next) => {
  const exerciseSet = await ExerciseSet.findById(req.params.exerciseSetId)

  if(!exerciseSet){
    return res.status(400).send({ success: false, error_message: 'No exercise set found with that id'})
  }

  exerciseSet.deleteOne()

  return res.status(200).json({ success: true, data: {} })

});


