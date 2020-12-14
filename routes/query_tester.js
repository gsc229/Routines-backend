const express = require('express')

// bring in controllers
const {queryExercise} = require('../controllers/query_tester')

// bring in models/schemas
const Exercise = require('../models/Exercise')

// bring in middlware variables
const advancedQuery = require('../middleware/advancedQuery')

// create router
const router = express.Router()

// routes
router
  .route('/exercise')
  .get(advancedQuery(Exercise), queryExercise)



// export router
module.exports = router