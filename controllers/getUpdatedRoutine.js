const Routine = require('../models/Routine')
const asyncHandler = require("../middleware/asyncHandler");

exports.getUpdatedRoutine = asyncHandler(async (req, res) => {

  const routineId = req.params.routineId
  const bulkWriteResultsData = req.body.bulkWriteResultsData

  const routineWithUpdates = await Routine.findById(routineId).populate({
    path: "weeks",
    populate: {
      path: "set_groups",
      populate: {
        path: "exercise_sets",
        populate: {
          path: "exercisse",
        },
      },
    },
  });

  if (routineWithUpdates) {
    return res
      .status(200)
      .json({
        success: true,
        updated_routine: routineWithUpdates,
        bulkwrite_data: bulkWriteResultsData,
      });
  }

  return res
    .status(500)
    .json({
      success: false,
      message: `Something went wrong trying to retrieve routine ${routineId} and it's updates. Try again later.`,
    });

    
});
