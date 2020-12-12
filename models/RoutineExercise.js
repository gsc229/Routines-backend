const mongoose = require('mongoose')

const RoutineExercise_Schema = new mongoose.Schema({
  exercise: {
    type:  mongoose.Types.ObjectId,
    required: [true, "Must provide exercise, routine and user ids"]
  },
  routine: {
    type:  mongoose.Types.ObjectId,
    required: [true, "Must provide exercise, routine and user ids"]
  },
  user: {
    type:  mongoose.Types.ObjectId,
    required: [true, "Must provide exercise, routine and user ids"]
  },
  week_number: {
    type: Number,
    default: null
  },
  day_of_week: {
    type: String,
    enum: ["U, M, T, W, R, F, S"],
    default: null
  },
  target_reps: {
    type: Number,
    default: null
  },
  target_sets: {
    type: Number,
    default: null
  },
  target_weight_kg: {
    type: Number,
    default: null
  },
  target_seconds: {
    type: Number,
    default: null
  },
  target_minutes: {
    type: Number,
    default: null
  },
  target_hours: {
    type: Number,
    default: null
  },
  target_distance_km: {
    type: Number,
    default: null
  },
  actual_reps: {
    type: Number,
    default: null
  },
  actual_sets: {
    type: Number,
    default: null
  },
  actual_weight_kg: {
    type: Number,
    default: null
  },
  actual_seconds: {
    type: Number,
    default: null
  },
  actual_minutes: {
    type: Number,
    default: null
  },
  actual_hours: {
    type: Number,
    default: null
  },
  actual_distance_km: {
    type: Number,
    default: null
  }

})


module.exports = mongoose.model('RoutineExercise', RoutineExercise_Schema)