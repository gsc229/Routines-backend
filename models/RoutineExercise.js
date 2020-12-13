const mongoose = require('mongoose')


const RoutineExercise_Schema = new mongoose.Schema({
  exercise: {
    type:  mongoose.Types.ObjectId,
    ref: 'Exercise',
    required: [true, "Must provide exercise, routine, week and user ids"]
  },
  routine: {
    type:  mongoose.Types.ObjectId,
    ref: 'Routine',
    required: [true, "Must provide exercise, routine, week and user ids"]
  },
  week: {
    type:  mongoose.Types.ObjectId,
    ref: 'RoutineWeek',
    required: [true, "Must provide exercise, routine, week and user ids"]
  },
  user: {
    type:  mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, "Must provide exercise, routine, week and user ids"]
  },
  day: {
    type: String,
    enum: ["U", "M", "T", "W", "R", "F", "S"],
    required: [true, "Must specify a day of week for a routine exercise - U, M, T, W, R, F, S"]
  },
  order: {
    type: Number,
    min: 0,
    max: 100
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
  rest_time: {
    interval: {
      type: String,
      enum: ['m', 's', 'h']
    },
    duration: {
      type: Number,
      min: 0,
      max: 60
    }
  },
  target_time: {
    interval: {
      type: String,
      enum: ['m', 's', 'h']
    },
    duration: {
      type: Number,
      min: 0,
      max: 60
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
  actual_sets: {
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
      enum: ['m', 's', 'h']
    },
    duration: {
      type: Number,
      min: 0,
      max: 60
    }
  },
  actual_distance_km: {
    type: Number,
    default: null
  },
  actual_laps: {
    type: Number,
    default: null
  }

})


module.exports = mongoose.model('RoutineExercise', RoutineExercise_Schema)