const ExerciseSet = require("../models/ExerciseSet");

const asyncHandler = require("../middleware/asyncHandler");
// @desc    Get all exercise sets
// @route   GET /api/v1.0/set-groups/exercises-sets
// @access  Private
exports.getExerciseSetRecords = asyncHandler(async (req, res) => {
  const userId = req.params.userId
    ? req.params.userId
    : req.query.user
    ? req.query.user
    : req.body.user;

  if (!userId) {
    return res.status(400).json({
      succuss: false,
      message:
        "You did not supply a user id. You can supply it in params, query or body",
    });
  }

  const userExerciseSets = await ExerciseSet.find({ user: userId }).populate({
    path: "exercise",
  });

  const records = {};

  const getActiveFields = (set) => {
    const activeFields = {};

    Object.entries(set).forEach((entry) => {
      if (entry[1] && entry[0] !== "exercise") {
        activeFields[entry[0]] = entry[1];
      }
    });

    return activeFields;
  };

  const getRepFactor = (set, key) => {
    if(!key.includes("weight") || !set.actual_reps) return null

    return set.actual_reps * set[key]
  
  }

  userExerciseSets.forEach((set) => {
    set = set.toObject();

    if (!records[set.exercise._id]) {
      records[set.exercise._id] = {
        exercise: set.exercise,
      };
    }

    Object.keys(set).forEach((key) => {

      if (set[key] && set[key] > 0 && key.includes("actual")) {

        const repFactor = getRepFactor(set, key)

        if(repFactor){
          if(!records[set.exercise._id]["rep_factor"]){
            records[set.exercise._id]["rep_factor"] = repFactor
            records[set.exercise._id]["record_rep_factor"] = getActiveFields(set)
          } else if(records[set.exercise._id]["rep_factor"] < repFactor){
            records[set.exercise._id]["rep_factor"] = repFactor
            records[set.exercise._id]["record_rep_factor"] = getActiveFields(set)
          }
        }

        if (!records[set.exercise._id][key]) {
          records[set.exercise._id][key] = set[key];
          return (records[set.exercise._id][`record_${key}`] =
            getActiveFields(set));
        }
        // lowest records i.e. shortest_time
        if (
          key.includes("shortest") &&
          records[set.exercise._id][key] > set[key]
        ) {
          records[set.exercise._id][key] = set[key];
          return (records[set.exercise._id][`record_${key}`] =
            getActiveFields(set));
        }
        // highest records i.e. heaviest weight, longest distance etc.
        if (records[set.exercise._id][key] < set[key]) {
          records[set.exercise._id][key] < set[key];
          return (records[set.exercise._id][`record_${key}`] =
            getActiveFields(set));
        }
      }
    });
  });

  return res.status(200).json({ success: true, data: Object.values(records) });
});
