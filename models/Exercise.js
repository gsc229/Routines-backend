const { ObjectID } = require('bson')
const mongoose = require('mongoose')

const Exercise_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name for the exercise"],
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
  original_creator: {
    type: mongoose.Types.ObjectId,  
    required: true, 
    ref: 'User'
  },
  bodyPart: {
    type: String, 
    required: [true, "Must provide a body part"], 
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
  },
  equipment: {
    type: String,
    default: 'none',
    maxlength: [50, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  },
  video_url: {
    type: String,
    minlength
  }

})



module.exports = mongoose.model('Exercise', Exercise_Schema)