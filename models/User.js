const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const User_Schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  gender: {
    type: String,
    enum: ["Male", "Female"]
  },
  age: {
    type: Number,
    min: [8, "Ages 8 and over"],
    max: [110, "Age must be below 110"]
  },
  weight_kg: {
    type: Number,
  },
  measurement_system: {
    type: String,
    enum: ["Imperial", "Metric"]
  },
  phone: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})


// ====== Hooks =======


// hash password 
User_Schema.pre('save', async function(next){

  if(!this.isModified('password')){
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

})

// match password
User_Schema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', User_Schema)