const mongoose = require('mongoose')

const SetGroup_Schema = new mongoose.Schema({
  exercise: {
    type:  mongoose.Types.ObjectId,
    ref: 'Exercise',
    required: [true, "Must provide exercise id"]
  },
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
  week_number: {
    type: Number,
    required: [true],
    min: 1,
    max: 7,
    default: 1
  },
  day_number: {
    type: Number,
    required: [true],
    min: 1,
    max: 7,
    default: 1
  },
  order: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  day: {
    type: String,
    enum: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    //required: [true, "Must specify a day of week for a set group - Su, Mo, Tu, We, Th, Fr, Sa"]
  },
  set_group_type: {
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
    "Pre-Exhaustion",
    null,
    ""
    ],
    default: null
  },
  name: {
    type: String,
    trim: true,
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
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
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
  foreignField: 'set_group',
  justOne: false
})

module.exports = mongoose.model('SetGroup', SetGroup_Schema)