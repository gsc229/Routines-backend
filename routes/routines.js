const express = require('express')

// bring in controllers
const {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  editRoutine,
  deleteRoutine,
  createWeek,
  getAllWeeks,
  getWeekById,
  editWeek,
  deleteWeek
} = require('../controllers/routines')

const Routine = require('../models/Routine')
const RoutineWeek = require('../models/RoutineWeek')

// bring in middlware variables
const advancedQuery = require('../middleware/advancedQuery')

// create router
const router = express.Router()
// routes
/* ================ Routine Routes ==================== */
router
  .route('/')
  .post(createRoutine)
  .get(advancedQuery(Routine) ,getAllRoutines)

router
  .route('/routine/:routineId')
  .get(advancedQuery(Routine), getRoutineById)
  .put(editRoutine)
  .delete(deleteRoutine)

/* ============= Week Routes ================= */
router
  .route('/weeks')
  .post(createWeek)
  .get(advancedQuery(RoutineWeek), getAllWeeks)

router
  .route('/weeks/:weekId')
  .get(advancedQuery(RoutineWeek), getWeekById)
  .put(editWeek)
  .delete(deleteWeek)


// export router
module.exports = router