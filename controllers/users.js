const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')


// @desc    Get a single User
// @route   GET /api/v1.0/Users/:userId
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {

 
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
      );
    }

    res.status(200).json({ success: true, data: user });


});
