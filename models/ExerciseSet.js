const mongoose = require('mongoose')

const ExerciseSet_Schema = new mongoose.Schema({
  exercise: {
    type:  mongoose.Types.ObjectId,
    ref: 'Exercise',
    required: [true, "Must provide exercise, routine, week, set group and user ids"]
  },
  routine: {
    type:  mongoose.Types.ObjectId,
    ref: 'Routine',
    required: [true, "Must provide exercise, routine, week, set group and user ids"]
  },
  week: {
    type:  mongoose.Types.ObjectId,
    ref: 'RoutineWeek',
    required: [true, "Must provide exercise, routine, week, set group and user ids"]
  },
  set_group: {
    type: mongoose.Types.ObjectId,
    ref: 'SetGroup',
    required: [true, "Must provide exercise, routine, week, set group and user ids"]
  },
  user: {
    type:  mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, "Must provide exercise, routine, week, set group and user ids"]
  },
  day: {
    type: String,
    enum: ["U", "M", "T", "W", "R", "F", "S"],
    required: [true, "Must specify a day of week for a set group - U, M, T, W, R, F, S"]
  },
  order: {
    type: Number,
    min: 0,
    max: 100
  },
  set_type: {
    type: String,
    enum: [
    "Straight",
    "Super",
    "Super - Antagonist", 
    "Super - Compound", 
    "Super - Tri", 
    "Super - Giant", 
    "Circuit", 
    "Pyramid",
    "Drop",
    "Stripping",
    "Rest - Pause",
    "Pre-Exhaustion"
    ],
    default: null
  },
  scheduled_time: {
    type: Date,
    default: null
  },
  completed_time: {
    type: Date,
    default: null
  },
  target_reps: {
    type: Number,
    default: null
  },
  target_weight_kg: {
    type: Number,
    default: null
  },
  rest_time: {
    interval: {
      type: String,
      enum: ['m', 's', 'h'],
      default: null
    },
    duration: {
      type: Number,
      min: 0,
      max: 60,
      default: null
    }
  },
  target_time: {
    interval: {
      type: String,
      enum: ['m', 's', 'h'],
      default: null
    },
    duration: {
      type: Number,
      min: 0,
      max: 60,
      default: null
    }
  },
  target_distance_km: {
    type: Number,
    default: null
  },
  target_laps: {
    type: Number,
    default: null
  },
  actual_reps: {
    type: Number,
    default: null
  },
  actual_weight_kg: {
    type: Number,
    default: null
  },
  actual_time: {
    interval: {
      type: String,
      enum: ['m', 's', 'h'],
      default: null
    },
    duration: {
      type: Number,
      min: 0,
      max: 60,
      default: null
    }
  },
  actual_distance_km: {
    type: Number,
    default: null
  },
  actual_laps: {
    type: Number,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }

})


module.exports = mongoose.model('ExerciseSet', ExerciseSet_Schema)