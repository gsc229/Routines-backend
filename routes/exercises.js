const express = require('express')

// bring in controllers
const {createExercise, getAllExercises} = require('../controllers/exercises')
// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createExercise)
  .get(getAllExercises)
  
// export router
module.exports = router