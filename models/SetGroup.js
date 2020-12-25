const mongoose = require('mongoose')

const SetGroup_Schema = new mongoose.Schema({
  routine: {
    type:  mongoose.Types.ObjectId,
    ref: 'Routine',
    required: [true, "Must provide exercise, routine, week, and user ids and day"]
  },
  week: {
    type:  mongoose.Types.ObjectId,
    ref: 'RoutineWeek',
    required: [true, "Must provide exercise, routine, week, and user ids and day"]
  },
  user: {
    type:  mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, "Must provide exercise, routine, week, and user ids and day"]
  },
  day: {
    type: String,
    enum: ["U", "M", "T", "W", "R", "F", "S"],
    required: [true, "Must specify a day of week for a set group - U, M, T, W, R, F, S"]
  }, 
  scheduled_time: {
    type: Date
  },
  completed_time: {
    type: Date
  },
  order: {
    type: Number,
    min: 0,
    max: 100
  },
  actual_sets: {
    type: Number,
    default: null
  },
  target_sets: {
    type: Number,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

/* ================ DELETE Cascading ======================= */
SetGroup_Schema.pre('deleteOne', {document:true, query: false}, async function(next){
  console.log(`DELETE SetGroup cascade to ExerciseSet`)

  await this.model('ExerciseSet').deleteMany({
    week: this._id
  })
  next()
})

SetGroup_Schema.virtual('exercise_sets', {
  ref: "ExerciseSet",
  localField: '_id',
  foreignField: 'week',
  justOne: false
})

module.exports = mongoose.model('SetGroup', SetGroup_Schema)