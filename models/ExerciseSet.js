const mongoose = require('mongoose')
const User = require('../models/User')
const Exercise = require('../models/Exercise')

const ExerciseSet_Schema = new mongoose.Schema({
  exercise: {
    type:  mongoose.Types.ObjectId,
    ref: 'Exercise',
    required: [true, "Must provide exercise id"]
  },
  routine: {
    type:  mongoose.Types.ObjectId,
    ref: 'Routine',
    required: [true, "Must provide exercise, routine id"]
  },
  week: {
    type:  mongoose.Types.ObjectId,
    ref: 'RoutineWeek',
    required: [true, "Must provide week id"]
  },
  set_group: {
    type: mongoose.Types.ObjectId,
    ref: 'SetGroup',
    required: [true, "Must provide set group id"]
  },
  user: {
    type:  mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, "Must provide user id"]
  },
  copied_from: {
    type: mongoose.Types.ObjectId,
    ref: 'ExerciseSet',
    default: null
  },
  exercise_name: {
    type: String,
    trim: true    
  },
  color: {
    type: String,
    trim: true
  },
  day: {
    type: String, 
    enum: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "", null]
  },
  day_number:{
    type: Number,
    min: 1,
    max: 7
  },
  order: {
    type: Number,
    min: 0,
    max: 100
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard", "Extreme", "", null],
    default: null
  },
  difficulty_scale: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  unit_of_measurement: {
    type: String,
    enum: ["Imperial", "Metric"],
    default: "Metric"
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
  target_weight: {
    type: Number,
    default: null
  },
  rest_time: {
      type: Number,
      default: null
  },
  target_time: {
    type: Number,
    default: null
  },
  target_hours: {
    type: Number,
    default: null
  },
  target_minutes: {
    type: Number,
    default: null
  },
  target_seconds:{
    type: Number,
    default: null
  },
  target_distance: {
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
  actual_weight: {
    type: Number,
    default: null
  },
  actual_time: {
    type: Number,
    default: null
  },
  actual_hours: {
    type: Number,
    default: null
  },
  actual_minutes: {
    type: Number,
    default: null
  },
  actual_seconds:{
    type: Number,
    default: null
  },
  actual_distance: {
    type: Number,
    default: null
  },
  actual_laps: {
    type: Number,
    default: null
  }
},{
  timestamps: true
})


ExerciseSet_Schema.pre('save', async function(next){
  const user = await User.findById(this.user)
  const exercise = await Exercise.findById(this.exercise)
  if(user){
    this.unit_of_measurement = user.measurement_system
  }

  if(exercise){
    this.exercise_name = exercise.name
    this.exercise = exercise
  }

  next()
})


module.exports = mongoose.model('ExerciseSet', ExerciseSet_Schema)