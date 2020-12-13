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
  },
  sunday: {
    exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
    notes: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
  },
  monday: {
    exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
    notes: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
  },
  tuesday: {
    exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
    notes: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
  },
  wednesday: {
    exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
    notes: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
  },
  thursday: {
    exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
    notes: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
  },
  friday: {
    exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
    notes: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
  },
  saturday: {
    exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
    notes: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
  }
  
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})

module.exports = mongoose.model('RoutineWeek', RoutineWeek_Schema)