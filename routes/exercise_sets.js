const express = require('express')
const { getRoutineById } = require('../controllers/routines')
//  /api/v1.0/routine-exercise

// bring in controllers
const {
  createExerciseSet, 
  getAllExerciseSets, 
  deleteExerciseSets,
  getExerciseSetById,
  editExerciseSet
} = require('../controllers/exercise_sets')
// bring in models/schemas
const ExerciseSet = require('../models/ExerciseSet')

// bring in middlware variables
const advancedQuery = require('../middleware/advancedQuery')

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createExerciseSet)
  .get(advancedQuery(ExerciseSet) , getAllExerciseSets)

router
  .route('/:ExerciseSetId')
  .get(advancedQuery(ExerciseSet) ,getExerciseSetById)
  .put(editExerciseSet)
  .delete(deleteExerciseSets)

// export router
module.exports = router