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
    type: Number
  }
},
{
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

RoutineWeek_Schema.virtual('exercises', {
  ref: "RoutineExercise",
  localField: '_id',
  foreignField: 'week',
  justOne: false
})

module.exports = mongoose.model('RoutineWeek', RoutineWeek_Schema)