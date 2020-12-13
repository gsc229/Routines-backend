const Routine = require('../models/Routine')
const Week = require('../models/RoutineWeek')
const Day = require('../models/RoutineDay')
const RoutineExercise = require('../models/RoutineExercise')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const e = require('express');


/* =========================== ROUTINE ======================================= */
// @desc    Create a new routine - required fields: original_creator, user, name
// @route   POST /api/v1.0/routines
// @access  Private
exports.createRoutine = asyncHandler(async (req, res, next) => {

  const routine = new Routine(req.body)

  routine.save((err, routine) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    res.status(201).send({ success: true, data: routine });
  })
  
});

// @desc    Get all routines
// @route   GET /api/v1.0/routines
// @access  Private
exports.getAllRoutines = asyncHandler(async (req, res, next) => {

  Routine
  .find()
  .populate({
    path: 'weeks',
    populate: {
      path: 'exercises',
      populate: {
        path: 'exercise'
      }
    }
  })
  .exec((err, routines) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    res.status(201).send({ success: true, data: routines })
    
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
      if(err){
        return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
      }

      res.status(201).send({ success: true, data: routineToDelete, message: "Routine was deleted!" })

    })
  
});

/* =========================== WEEK ======================================= */
// @desc    Create a new week for a routine - required fields: user, routine
// @route   POST /api/v1.0/routines/weeks
// @access  Private
exports.createWeek = asyncHandler(async (req, res, next) => {
  const week = new Week(req.body)

  week.save((err, week) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    } 

    res.status(201).send({ success: true, data: week });
  })
  
});

// @desc    Get all weeks from all routines - required fields: original_creator, user, name
// @route   GET /api/v1.0/routines/weeks
// @access  Private
exports.getAllWeeks = asyncHandler(async (req, res, next) => {

  Week
  .find()
  .populate({
    path: 'exercises',
    populate: {
      path: 'exercise'
    }
  })
  .exec((err, weeks) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    res.status(201).send({ success: true, data: weeks })
    
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

    res.status(201).send({ success: true, data: week })
    
  })
  
});




