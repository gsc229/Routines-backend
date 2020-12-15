const express = require('express')

// bring in controllers
const {queryExercise, queryRoutines, queryRoutineEx} = require('../controllers/query_tester')

// bring in models/schemas
const Exercise = require('../models/Exercise')
const Routine = require('../models/Routine')
const RoutineEx = require('../models/RoutineExercise')

// bring in middlware variables
const advancedQuery = require('../middleware/advancedQuery')
const RoutineExercise = require('../models/RoutineExercise')

// create router
const router = express.Router()

// routes
router
  .route('/exercise')
  .get(advancedQuery(Exercise), queryExercise)
router
  .route('/routines')
  .get(advancedQuery(Routine), queryRoutines)

router
  .route('/routine-exercises')
  .get(advancedQuery(RoutineExercise), queryRoutineEx)



// export router
module.exports = router