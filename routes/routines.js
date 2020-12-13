const express = require('express')

// bring in controllers
const {
  createRoutine,
  createWeek,
  createDay, 
  getAllRoutines
} = require('../controllers/routines')

// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router()
// routes
router
  .route('/')
  .post(createRoutine)
  .get(getAllRoutines)

router
  .route('/weeks')
  .post(createWeek)



// export router
module.exports = router