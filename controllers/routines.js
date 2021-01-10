const Routine = require('../models/Routine')
const Week = require('../models/RoutineWeek')
const SetGroup = require('../models/SetGroup')
const ExerciseSet = require('../models/ExerciseSet')
const asyncHandler = require("../middleware/asyncHandler");



/* =========================== ROUTINE ======================================= */
// @desc    Create a new routine - required fields: original_creator, user, name
// @route   POST /api/v1.0/routines
// @access  Private
exports.createRoutine = asyncHandler(async (req, res, next) => {
  
  const newRoutine = new Routine(req.body)

  newRoutine.save((err, routine) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    return res.status(201).send({ success: true, data: routine });
  })
  
});

// @desc    Get all routines
// @route   GET /api/v1.0/routines
// @access  Private
exports.getAllRoutines = asyncHandler(async (req, res, next) => {

  res.status(200).send(res.advancedResults)
  
});

// @desc    Get a single routine by ID
// @route   GET /api/v1.0/routines/routine/:routineId
// @access  Private
exports.getRoutineById = asyncHandler(async (req, res, next) => {

  res.status(200).send(res.advancedResults)
  
});

// @desc    Get a single routine by ID with weeks, set_groups, and exercise_sets populated with the exercise
// @route   GET /api/v1.0/routines/flattened-routine/:routineId
// @access  Private
exports.getFlattenedRoutine = asyncHandler( async(req, res, next) => {

  const routineId = req.params.routineId
  if(!routineId){
    return res.status(400).send({success: false, error_message: 'You did not supply a routine id'})
  }

  const routine = await Routine.findById(routineId)
  if(!routine){
    return res.status(400).send({success: false, error_message: `No routine found with _id of ${routineId}`})
  }

  const weeks = await Week.find({routine: routineId})
  const set_groups = await SetGroup.find({routine: routineId})
  const exercise_sets = await ExerciseSet.find({routine: routineId}).populate('exercise')

  return res.status(200).send({success: true, data: {routine, weeks, set_groups, exercise_sets}})

});

// @desc    Edit a single routine by ID
// @route   PUT /api/v1.0/routines/routine/:routineId
// @access  Private
exports.editRoutine = asyncHandler(async (req, res, next) => {
  console.log('editRoutine\n '.red, {body: req.body, params: req.params})
  await Routine
  .findByIdAndUpdate(
    req.params.routineId , // id
    req.body, // changes
    {new: true, runValidators: true}, // options

    (err, routine) => { // callback
    console.log({err, routine})
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    if(routine){
      console.log({routine, reqBody: req.body})
      return res.status(201).send({ success: true, data: routine })
    }

    return res.status(400).send({success: false, error_message: `No routine found with id of ${req.params.routineId}`})

  })
  
  
});


// @desc    Delete a routine and all it's children
// @route   DELETE /api/v1.0/routines/:routineId
// @access  Private
exports.deleteRoutine = asyncHandler(async (req, res, next) => {

  const routineToDelete = await Routine.findById(req.params.routineId)

  if(!routineToDelete){
    return res.status(400).send({success: false, error_message: "Routine with that id not found" })
  }

  routineToDelete
    .deleteOne((err, routine)=>{
      console.log({err, routine})
      if(err){
        return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
      }

      return res.status(201).send({ success: true, data: routine, message: "Routine was deleted!" })

    })
  
});

/* =========================== WEEK ======================================= */
// @desc    Create a new week for a routine - required fields: user, routine
// @route   POST /api/v1.0/routines/weeks
// @access  Private
exports.createWeek = asyncHandler(async (req, res, next) => {

  // Check if routine exists
  const routine = await Routine.findById(req.body.routine)

  if(!routine){
    return res.status(400).send({success: false, error_message: `No routine found with id of ${req.body.routine}`})
  }

  const week = new Week(req.body)

  week.save((err, week) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    return res.status(201).send({ success: true, data: week });
  })
  
});

// @desc    Get all weeks from all routines - required fields: original_creator, user, name
// @route   GET /api/v1.0/routines/weeks
// @access  Private
exports.getAllWeeks = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults)
  
});

// @desc    Get a Week by ID
// @route   GET /api/v1.0/routines/weeks/:weekId
// @access  Private
exports.getWeekById = asyncHandler(async (req, res, next) => {

  res.status(200).send(res.advancedResults)
  
});

// @desc    Edit a week by ID
// @route   PUT /api/v1.0/routines/weeks/:weekId
// @access  Private
exports.editWeek = asyncHandler(async (req, res, next) => {

  await Week
  .findByIdAndUpdate(
    req.params.weekId , // id
    req.body, // changes
    {new: true, runValidators: true}, // options

    (err, week) => { // callback

    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    if(week){
      return res.status(201).send({ success: true, data: week })
    }

    return res.status(400).send({success: false, error_message: `No week found with id of ${req.params.weekId}`})

  })
  
  
});



// @desc    Delete a week and all it's children
// @route   DELETE /api/v1.0/routines/weeks/:weekId
// @access  Private
exports.deleteWeek = asyncHandler(async (req, res, next) => {

  const weekToDelete = await Week.findById(req.params.weekId)
  
  weekToDelete
  .deleteOne((err, week) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    return res.status(201).send({ success: true, data: week })
    
  })
  
});




