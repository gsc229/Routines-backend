const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')


// @desc    Create a new user
// @route   POST /api/v1.0/auth/create-user
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;
  
  const newUser = await User.create({
    email,
    username,
    password
  });

  const userSansPw = await User.findOne({
    email
  })

  if(!userSansPw){
    return next(new ErrorResponse('There was a problem creating a new user', 500))
  }

  res.status(201).send({ user: userSansPw});
});

// @desc    Login user
// @route   POST /api/v1.0/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password){
    return next(new ErrorResponse("Please provide both email and password to login", 400))
  }

  const foundUser = await User.findOne({
    email
  }).select('+password');

  if(!foundUser){
    return next(new ErrorResponse("We didn't find a user with that email.", ))
  }

  const isMatch = await foundUser.matchPassword(password)

  if(!isMatch){
    return next(new ErrorResponse("Invalid username or password", 401))
  }

  const userSansPw = await User.findOne({
    email
  })
  
  console.log({foundUser})
  console.log({userSansPw})
  res.status(201).send({ user: userSansPw });
});