const mongoose = require('mongoose')

const Exercise_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name for the exercise"],
    maxlength: [50, "Cannot exceed 50 characters"],  
  },
  category: {
    type: String, 
    enum: [ "Endurance", "Strength", "Flexibility", "Balance", null, ""]
  },
  difficulty: {
    type: String,
    enum: [ "Easy", "Medium", "Hard", "Extreme", null, ""]
  },
  measures: {
    type: [String],
    enum: ["weight", "reps", "distance", "time", "laps", null, ""]
  },
  difficulty_scale: {
    type: Number,
    min: [1, "Must be a number between 1 and 10" ],
    max: [10, "Must be a number between 1 and 10" ],
    default: 1
  },
  description: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"]
  },
  original_creator: {
    type: mongoose.Types.ObjectId, 
    ref: 'User',  
    required: [true, "Needs the id of the originial creator"]
  },
  copied_from: {
    type: mongoose.Types.ObjectId,
    ref: 'Exercise',
    default: null
  },
  body_part: {
    type: String,
    trim: true,
    maxlength: [50, "Cannot exceed 50 characters"]
  },
  muscle_group: {
    type: String,
    enum: ["Chest", "Back", "Arms", "Shoulders", "Legs", "Calves", "Full Body", "Multiple Major Muscle Groups", "",null],
    default: null
  },
  target_muscle: {
    type: String,
    trim: true,
    maxlength: [50, "Cannot exceed 50 characters"],  
  },
  equipment: {
    type: String,
    trim: true,
    default: 'none',
    maxlength: [50, "Cannot exceed 50 characters"],
  },
  video_url: {
    type: String,
    trim: true,
  }

},{
  timestamps: true
})



module.exports = mongoose.model('Exercise', Exercise_Schema)