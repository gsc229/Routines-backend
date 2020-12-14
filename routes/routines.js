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

// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router()
// routes
/* ================ Routine Routes ==================== */
router
  .route('/')
  .post(createRoutine)
  .get(getAllRoutines)

router
  .route('/routine/:routineId')
  .get(getRoutineById)
  .put(editRoutine)
  .delete(deleteRoutine)

/* ============= Week Routes ================= */
router
  .route('/weeks')
  .post(createWeek)
  .get(getAllWeeks)

router
  .route('/weeks/:weekId')
  .get(getWeekById)
  .put(editWeek)
  .delete(deleteWeek)


// export router
module.exports = router