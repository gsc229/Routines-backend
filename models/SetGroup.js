const mongoose = require('mongoose')

const SetGroup_Schema = new mongoose.Schema({
  routine: {
    type:  mongoose.Types.ObjectId,
    ref: 'Routine',
    required: [true, "Must routine id"]
  },
  week: {
    type:  mongoose.Types.ObjectId,
    ref: 'RoutineWeek',
    required: [true, "Must provide a week id"]
  },
  user: {
    type:  mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, "Must provide a user id"]
  },
  week_number: {
    type: Number,
    required: [true, "Must provide a week number"],
    min: 1,
    max: 50,
  },
  day_number: {
    type: Number,
    required: [true, "Must provide a day number"],
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
  }
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
  timestamps: true
})

/* ================ DELETE Cascading ======================= */
SetGroup_Schema.pre('deleteOne', {document:true, query: false}, async function(next){
  console.log(`DELETE SetGroup cascade to ExerciseSet`)

  await this.model('ExerciseSet').deleteMany({
    set_group: this._id
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