const express = require('express')

// bring in controllers
const {createExercise, getAllExercises, getExerciseById, editExercise, deleteExercises} = require('../controllers/exercises')
// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createExercise)
  .get(getAllExercises)

router
  .route('/:exerciseId')
  .put(editExercise)
  .get(getExerciseById)
  .delete(deleteExercises)
  
// export router
module.exports = router