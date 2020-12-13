const express = require('express')
//  /api/v1.0/routine-exercise

// bring in controllers
const {createRoutineExercise, getAllRoutineExercises} = require('../controllers/routine_exercises')
// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createRoutineExercise)
  .get(getAllRoutineExercises)
// export router
module.exports = router