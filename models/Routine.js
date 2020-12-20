const mongoose = require('mongoose')

const Routine_Schema = new mongoose.Schema({
    start_date: {
      type: Date,
      default: null
    },
    end_date: {
      type: Date,
      default: null
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',  
      required: [true, "Needs the id of the current user"]
    },
    original_creator: {
      type: mongoose.Types.ObjectId,  
      required: [true, "Needs the id of the originial creator"], 
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, "Must provide a routine name"], 
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    },
    category: {
      type: String, 
      enum: ["Endurance", "Strength", "Flexibility", "Balance"],
      default: null
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Extreme"],
      default: null
    },
    description: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"],
      default: null
    },
    body_part: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    },
    muscle_group: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"],
      default: null
    },
    target_muscle: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"],
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
Routine_Schema.pre('deleteOne', {document:true, query: false}, async function(next){
  console.log(`DELETE Routine cascade RoutineWeek, ExerciseSet`)
  console.log({this: this, thisDotId: this._id})

  await this.model('RoutineWeek').deleteMany({
    routine: this._id
  })
  await this.model('ExerciseSet').deleteMany({
    routine: this._id
  })
  
  next()
})


/* =================== Populate Virtuals ================= */
Routine_Schema.virtual('weeks', {
  ref: 'RoutineWeek',
  localField: '_id',
  foreignField: 'routine',
  justOne: false
})

Routine_Schema.virtual('exercises', {
  ref: 'ExerciseSet',
  localField: '_id',
  foreignField: 'routine',
  justOne: false
})

module.exports = mongoose.model('Routine', Routine_Schema)
