const mongoose = require('mongoose')

const RoutineWeek_Schema = new mongoose.Schema({
  routine: {
    type: mongoose.Types.ObjectId,  
    required: [true, "Needs the id of the routine"], 
    ref: 'Routine'
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "Needs the id of the user"], 
    ref: 'User'
  },
  week_number: {
    type: Number,
    default: null,
    //required: [true, "Need a week number"]
  },
  week_of_year: {
    type: Number,
    default: null
  },
  week_start_date: {
    type: Date,
    default: null
  },
  year: {
    type: Date,
    default: null
  }
},
{
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  timestamps: true
})

/* ================ DELETE Cascading ======================= */
RoutineWeek_Schema.pre('deleteOne', {document:true, query: false}, async function(next){
  console.log(`DELETE RoutineWeek cascade to SetGroup, ExerciseSet`)

  await this.model('SetGroup').deleteMany({
    week: this._id
  })
  
  await this.model('ExerciseSet').deleteMany({
    week: this._id
  })
  next()
})

/* =================== Populate Virtuals ================= */

RoutineWeek_Schema.virtual('set_groups', {
  ref: "SetGroup",
  localField: '_id',
  foreignField: 'week',
  justOne: false
})

RoutineWeek_Schema.virtual('exercise_sets', {
  ref: "ExerciseSet",
  localField: '_id',
  foreignField: 'week',
  justOne: false
})

module.exports = mongoose.model('RoutineWeek', RoutineWeek_Schema)