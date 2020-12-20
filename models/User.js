const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
    enum: ["Male", "Female"],
    default: null
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
    enum: ["Imperial", "Metric"],
    default: "Metric"
  },
  phone: {
    type: String,
    default: null
  },
  token: {
    type: String
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

// Sign JWT and return
User_Schema.methods.getSignedJwtToken = function() {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  this.token = token

  return token
};

// match password
User_Schema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
User_Schema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', User_Schema)