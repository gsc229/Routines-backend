const express = require('express')
const { getRoutineById } = require('../controllers/routines')
//  /api/v1.0/routine-exercise

// bring in controllers
const {
  createRoutineExercise, 
  getAllRoutineExercises, 
  deleteRoutineExercises,
  getRoutineExById,
  editRoutineEx
} = require('../controllers/routine_exercises')
// bring in models/schemas
const RoutineExercise = require('../models/RoutineExercise')

// bring in middlware variables
const advancedQuery = require('../middleware/advancedQuery')

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createRoutineExercise)
  .get(advancedQuery(RoutineExercise) , getAllRoutineExercises)

router
  .route('/:routineExId')
  .get(advancedQuery(RoutineExercise) ,getRoutineExById)
  .put(editRoutineEx)
  .delete(deleteRoutineExercises)

// export router
module.exports = router