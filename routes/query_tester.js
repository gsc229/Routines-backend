const express = require("express");

// bring in controllers
const {
  queryExercise,
  queryRoutines,
  queryRoutineEx,
} = require("../controllers/query_tester");

// bring in models/schemas
const Exercise = require("../models/Exercise");
const Routine = require("../models/Routine");
const RoutineEx = require("../models/ExerciseSet");

// bring in middlware variables
const advancedQuery = require("../middleware/advancedQuery");
const ExerciseSet = require("../models/ExerciseSet");

// create router
const router = express.Router();

// routes
router.route("/exercise").get(advancedQuery(Exercise), queryExercise);
router.route("/routines").get(advancedQuery(Routine), queryRoutines);

router
  .route("/routine-exercises")
  .get(advancedQuery(ExerciseSet), queryRoutineEx);

// export router
module.exports = router;
