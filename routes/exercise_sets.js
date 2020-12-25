const express = require('express')
//  /api/v1.0/set-groups

// bring in controllers
const {
  createExerciseSet, 
  getAllExerciseSets, 
  deleteExerciseSets,
  getExerciseSetById,
  editExerciseSet
} = require('../controllers/excercise_sets')
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
  .route('/:exerciseSetId')
  .get(advancedQuery(ExerciseSet) ,getExerciseSetById)
  .put(editExerciseSet)
  .delete(deleteExerciseSets)



// export router
module.exports = router