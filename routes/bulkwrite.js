const express = require("express");
//  /api/v1.0/set-groups

// bring in controllers
const {
  bulkWrite,
  afterWriteQuery
} = require("../controllers/bulkwrite");


// create router
const router = express.Router();

// routes
router
  .route("/")
  .put(bulkWrite, afterWriteQuery)
// export router
module.exports = router;
