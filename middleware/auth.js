const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

exports.requiresUserCredendtials = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
  }
});
