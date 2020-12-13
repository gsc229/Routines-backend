const express = require('express')

// bring in controllers
const {
  createRoutine,
  createWeek,
  getAllRoutines,
  getAllWeeks,
  deleteRoutine,
  deleteWeek
} = require('../controllers/routines')

// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router()
// routes
/* Routine Routes */
router
  .route('/')
  .post(createRoutine)
  .get(getAllRoutines)

router
  .route('/:routineId')
  .delete(deleteRoutine)

/* Week Routes */
router
  .route('/weeks')
  .post(createWeek)
  .get(getAllWeeks)

router
  .route('/weeks/:weekId')
  .delete(deleteWeek)


// export router
module.exports = router