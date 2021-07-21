const express = require('express')
const { updateRoutineDates  } = require('../controllers/updateRoutineDates')
const { updateWeekDates } = require('../controllers/updateWeekDates')
const { getUpdatedRoutine } = require('../controllers/getUpdatedRoutine')
// bring in controllers
const {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  getFlattenedRoutine,
  editRoutine,
  deleteRoutine,
  createWeek,
  getAllWeeks,
  getWeekById,
  editWeek,
  bulkWriteWeeks,
  deleteWeek
} = require('../controllers/routines')
/* '/api/v1.0/routines' */
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
  .route('/flattened-routine/:routineId')
  .get(getFlattenedRoutine)

router
  .route('/routine/:routineId')
  .get(advancedQuery(Routine), getRoutineById)
  .put(editRoutine)
  .delete(deleteRoutine)

router
.route('/update-routine-dates/:routineId')
.put(updateRoutineDates, advancedQuery(Routine), getUpdatedRoutine)


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

  router
    .route('/bulk-write/weeks')
    .put(bulkWriteWeeks)

  router
  .route('/weeks/update-week-dates/:weekId')
  .put(updateWeekDates, advancedQuery(Routine), getUpdatedRoutine)
  

// export router
module.exports = router