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

// bring in middlware variables

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createRoutineExercise)
  .get(getAllRoutineExercises)

router
  .route('/:routineExId')
  .get(getRoutineExById)
  .put(editRoutineEx)
  .delete(deleteRoutineExercises)

// export router
module.exports = router