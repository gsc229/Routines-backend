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


// @desc    Create a new routine - required fields: original_creator, user, name
// @route   GET /api/v1.0/routines
// @access  Private
exports.getAllRoutines = asyncHandler(async (req, res, next) => {

  Routine.find().exec((err, routines) => {
    if(err){
      return res.status(400).send({success: false, error_message: err.message, error_name: err.name })
    }

    res.status(201).send({ success: true, data: routines })
    
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




