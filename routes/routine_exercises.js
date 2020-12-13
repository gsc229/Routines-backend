const express = require('express')
//  /api/v1.0/routine-exercise

// bring in controllers
const {createRoutineExercise, getAllRoutineExercises, deleteRoutineExercises} = require('../controllers/routine_exercises')
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
  .delete(deleteRoutineExercises)

// export router
module.exports = router