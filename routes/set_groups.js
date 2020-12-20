const express = require('express')
//  /api/v1.0/set-groups

// bring in controllers
const {
  createSetGroup,
  getAllSetGroups,
  getSetGroupById,
  editSetGroup,
  deleteSetGroup,
  createExerciseSet, 
  getAllExerciseSets, 
  deleteExerciseSets,
  getExerciseSetById,
  editExerciseSet
} = require('../controllers/set_groups')
// bring in models/schemas
const SetGroup = require('../models/SetGroup')
const ExerciseSet = require('../models/ExerciseSet')

// bring in middlware variables
const advancedQuery = require('../middleware/advancedQuery')

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createSetGroup)
  .get(advancedQuery(SetGroup), getAllSetGroups)
  
router
  .route('/:setGroupId')
  .get(advancedQuery(SetGroup), getSetGroupById)
  .put(editSetGroup)
  .delete(deleteSetGroup)

router
  .route('/exercise-sets')
  .post(createExerciseSet)
  .get(advancedQuery(ExerciseSet) , getAllExerciseSets)

router
  .route('/:exerciseSetId')
  .get(advancedQuery(ExerciseSet) ,getExerciseSetById)
  .put(editExerciseSet)
  .delete(deleteExerciseSets)



// export router
module.exports = router