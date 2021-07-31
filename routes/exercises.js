const express = require("express");

// bring in controllers
const {
  createExercise,
  getAllExercises,
  getExerciseById,
  editExercise,
  deleteExercises,
} = require("../controllers/exercises");
// bring in models/schemas
const Exercise = require("../models/Exercise");

// bring in middlware variables
const advanceQuery = require("../middleware/advancedQuery");

// create router
const router = express.Router();

// routes
router
  .route("/")
  .post(createExercise)
  .get(advanceQuery(Exercise), getAllExercises);

router
  .route("/:exerciseId")
  .put(editExercise)
  .get(advanceQuery(Exercise), getExerciseById)
  .delete(deleteExercises);

// export router
module.exports = router;
