const Exercise = require('../models/Exercise.js')
const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')


// @desc    Create a new exercise
// @route   POST /api/v1.0/exercises
// @access  Private
exports.createExercise = asyncHandler(async (req, res, next) => {
  const { email, password, address, business_name } = req.body;

  const vendor = await Vendor.create({
    email,
    password,
    address,
    business_name
  });
  const token = await vendor.getSignedJwtToken();
  res.status(201).send({ vendor, token });
});