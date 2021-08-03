const express = require("express");

// bring in controllers
const { createUser, loginUser } = require("../controllers/auth");

// bring in models/schemas

// bring in middlware variables

// create router
const router = express.Router();

// routes
router.route("/new-user").post(createUser);

router.route("/login").post(loginUser);

// export router
module.exports = router;
