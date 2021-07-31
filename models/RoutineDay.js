const mongoose = require("mongoose");

const RoutineDay_Schema = new mongoose.Schema({
  routine: {
    type: mongoose.Types.ObjectId,
    ref: "Routine",
    required: [true, "Needs the id of the routine"],
  },
  week: {
    type: mongoose.Types.ObjectId,
    ref: "Routine",
    required: [true, "Needs the id of the week"],
  },
  day_of_week: {
    type: String,
    enum: ["U", "M", "T", "W", "R", "F", "S"],
    default: null,
    required: [true, "Needs to specify day of week"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "Needs the id of the user"],
    ref: "User",
  },
  exercises: [{ type: mongoose.Types.ObjectId, ref: "ExerciseSet" }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RoutineDay", RoutineDay_Schema);
