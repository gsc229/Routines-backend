const mongoose = require('mongoose')

const SetGroup_Schema = new mongoose.Schema({
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
    required: [true, "Must specify a day of week for a routine exercise - U, M, T, W, R, F, S"]
  },
  order: {
    type: Number,
    min: 0,
    max: 100
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('SetGroup', SetGroup_Schema)