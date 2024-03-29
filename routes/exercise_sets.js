const express = require("express");
//  /api/v1.0/exercise-sets

// bring in controllers
const {
  createExerciseSet,
  createManyExerciseSets,
  getAllExerciseSets,
  deleteExerciseSets,
  getExerciseSetById,
  editExerciseSet,
  bulkWriteExerciseSets,
} = require("../controllers/exercise_sets");
const { getExerciseSetRecords } = require("../controllers/exercise_set_records")
// bring in models/schemas
const ExerciseSet = require("../models/ExerciseSet");

// bring in middlware variables
const advancedQuery = require("../middleware/advancedQuery");

// create router
const router = express.Router();
// routes
router
  .route("/")
  .post(createExerciseSet)
  .get(advancedQuery(ExerciseSet), getAllExerciseSets);

router.route("/records").get(getExerciseSetRecords);
router.route("/records/:userId").get(getExerciseSetRecords);

router.route("/create-many").post(createManyExerciseSets);

router.route("/bulk-write").put(bulkWriteExerciseSets);

router
  .route("/:exerciseSetId")
  .get(advancedQuery(ExerciseSet), getExerciseSetById)
  .put(editExerciseSet)
  .delete(deleteExerciseSets);

// export router
module.exports = router;
