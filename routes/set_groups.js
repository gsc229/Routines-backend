const express = require("express");
//  /api/v1.0/set-groups

// bring in controllers
const {
  createSetGroup,
  getAllSetGroups,
  getSetGroupById,
  editSetGroup,
  updateManySetGroups,
  deleteSetGroup,
  bulkWriteSetGroups,
} = require("../controllers/set_groups");
// bring in models/schemas
const SetGroup = require("../models/SetGroup");

// bring in middlware variables
const advancedQuery = require("../middleware/advancedQuery");

// create router
const router = express.Router();

// routes
router
  .route("/")
  .post(createSetGroup)
  .get(advancedQuery(SetGroup), getAllSetGroups);
router.route("/update-many").put(updateManySetGroups);

router.route("/bulk-write").put(bulkWriteSetGroups);

router
  .route("/:setGroupId")
  .get(advancedQuery(SetGroup), getSetGroupById)
  .put(editSetGroup)
  .delete(deleteSetGroup);

// export router
module.exports = router;
