const express = require("express");

// bring in controllers
const { getUser } = require("../controllers/users");

// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router();

// routes
router.route("/:userId").get(getUser);

// export router
module.exports = router;
