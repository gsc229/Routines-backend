const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a new user
// @route   POST /api/v1.0/auth/create-user
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;
  console.log("createUser: body:", req.body);

  const newUser = new User(req.body);

  newUser.save((err, userSansPw) => {
    if (err) {
      console.log({ err });
      return res
        .status(400)
        .send({
          success: false,
          error_message: err.message,
          err_name: err.name,
        });
    }
    return sendTokenResponse(userSansPw, 200, res);
  });
});

// @desc    Login user
// @route   POST /api/v1.0/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: "Must provide an email and password",
        err_name: "",
      });
  }

  const foundUser = await User.findOne({
    email,
  }).select("+password");

  if (!foundUser) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: "Invalid email or password",
        err_name: "",
      });
  }

  const isMatch = await foundUser.matchPassword(password);

  if (!isMatch) {
    return res
      .status(400)
      .send({
        success: false,
        error_message: "Invalid email or password",
        err_name: "",
      });
  }

  return await User.findOne({
    email,
  }).exec((err, userSansPw) => {
    if (err) {
      return res
        .status(400)
        .send({
          success: false,
          error_message: err.message,
          err_name: err.name,
        });
    }

    return sendTokenResponse(userSansPw, 200, res);
  });
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  console.log({ expeiresJWT: process.env.JWT_COOKIE_EXPIRE });
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    data: user,
  });
};
