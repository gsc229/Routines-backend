const asyncHandler = require("../middleware/asyncHandler");

exports.queryExercise = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults);
});

exports.queryRoutines = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .send({
      success: true,
      data: res.advancedResults,
      bypass: res.bypass ? res.bypass : false,
    });
});

exports.queryRoutineEx = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .send({
      success: true,
      data: res.advancedResults,
      bypass: res.bypass ? res.bypass : false,
    });
});
