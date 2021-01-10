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

  const {routine, week, week_number, day_number, user} = req.body // day is the only one that's not an _id (UMTWRFS)

  if(!routine || !week || !week_number || !day_number || !user){
    return res.status(400).send({success: false, error_message: `Must provide routine id, week id, user id, week number, and day number`})
  }

  // Check if routine and week exists

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

    (err, setGroup) => { // callback

    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    if(setGroup){
      return res.status(201).send({ success: true, data: setGroup })
    }

    return res.status(400).send({success: false, error_message: `No set gruoup found with id of ${req.params.setGroupId}`})

  }).populate('exercise')

});

// @desc    Update many set groups
// @route   PUT /api/v1.0/set-groups/update-many
// @access  Private
exports.updateManySetGroups = asyncHandler(async (req, res, next) => {
  const { query, changes } = req.body // {week: 020wewlk220}, { week_number: 2 }
  console.log("updateMany".america ,{query, changes})
  await SetGroup
  .updateMany(
    query , // id
    changes, // changes
    {new: true}, // options

    (err, setGroups) => { // callback

    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    if(setGroups){
      return res.status(201).send({ success: true, data: setGroups })
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

  setGroup.deleteOne((err, setGroup) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }
    return res.status(201).send({ success: true, data: setGroup, message: "Set group was deleted!" })
  })

  

});





