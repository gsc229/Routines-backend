const Routine = require("../models/Routine");
const asyncHandler = require("./asyncHandler");
const dayjs = require("dayjs");

exports.validateCopyRoutineBody = asyncHandler(async (req, res, next) => {
  const sourceRoutineId = req.body.sourceRoutineId;
  const user = req.body.user;
  const start_date = req.body.start_date;
  const isTemplate = req.body.isTemplate

  if (!sourceRoutineId)
    res.status(400).json({
      success: false,
      message: "You did not include a sourceRoutineId in the request body",
    });
  if (!user)
    res.status(400).json({
      success: false,
      message: "You did not include a user (user id) in the request body",
    });
  if (!start_date)
    res.status(400).json({
      success: false,
      message: "You did not include a start_date in the request body",
    });

  if (!dayjs(start_date).isValid())
    res.status(400).json({
      success: false,
      message: `${start_date} is not a valid start_date`,
    });

  if (isTemplate === undefined || typeof isTemplate !== "boolean")
  res.status(400).json({
    success: false,
    message: "You need to specifiy a boolean, isTemplate, in the body of the request",
  });

  next();
});

exports.copyRoutineTemplate = asyncHandler(async (req, res, next) => {
  const { sourceRoutineId, user, start_date, isTemplate } = req.body;

  let RoutineSource = await Routine.findById(sourceRoutineId);

  if (!RoutineSource)
    return res.status(500).json({
      success: false,
      message: `Failed to copy routine. There's no routine with id of ${sourceRoutineId}`,
    });

  /* ======================== Copy Routine (top-level info) =================== */
  const routineInfoCopy = {
    ...RoutineSource.toObject(),
    is_template: isTemplate || false,
    sourceRoutineId,
    copied_from: sourceRoutineId,
    user,
    start_date,
  };

  delete routineInfoCopy._id;
  delete routineInfoCopy.id;
  delete routineInfoCopy.createdAt;
  delete routineInfoCopy.updatedAt;
  delete routineInfoCopy.__v;

  let NewRoutine = await new Routine(routineInfoCopy).save();

  if (!NewRoutine)
    return res.status(500).json({
      success: false,
      message: `Something went wrong creating routine from sourceRoutineId: ${sourceRoutineId}`,
    });

  NewRoutine = NewRoutine.toObject();

  // new routine's id to targetRoutine on the body the next middlwares, copyWeeks and/or upDateRoutineDates:
  req.body.destinationRoutineId = NewRoutine.id;
  req.body.copyingFullRoutine = true

  return next(); // send to copyWeeks
}); /* END */
