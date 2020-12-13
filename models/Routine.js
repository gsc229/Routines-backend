const mongoose = require('mongoose')

const Routine_Schema = new mongoose.Schema({
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
      enum: ["Endurance", "Strength", "Flexibility", "Balance"]
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Extreme"]
    },
    description: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    },
    body_part: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    },
    muscle_group: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    },
    target_muscle: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      minlength: [3, "Cannot be less than 3 characters"]
    }
    
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})

/* ================ DELETE Cascading ======================= */
Routine_Schema.pre('deleteOne', async function(next){
  console.log(`DELETE Routine cascade RoutineWeek, RoutineExercise`)
  await this.model('RoutineWeek').deleteMany({
    routine: this._id
  })
  await this.model('RoutineExercise').deleteMany({
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
  ref: 'RoutineExercise',
  localField: '_id',
  foreignField: 'routine',
  justOne: false
})

module.exports = mongoose.model('Routine', Routine_Schema)
