const express = require('express')
//  /api/v1.0/set-groups

// bring in controllers
const {
  createSetGroup,
  getAllSetGroups,
  getSetGroupById,
  editSetGroup,
  deleteSetGroup
} = require('../controllers/set_groups')
// bring in models/schemas
const SetGroup = require('../models/SetGroup')

// bring in middlware variables
const advancedQuery = require('../middleware/advancedQuery')

// create router
const router = express.Router()

// routes
router
  .route('/')
  .post(createSetGroup)
  .get(advancedQuery(SetGroup), getAllSetGroups)
  
router
  .route('/:setGroupId')
  .get(advancedQuery(SetGroup), getSetGroupById)
  .put(editSetGroup)
  .delete(deleteSetGroup)



// export router
module.exports = router