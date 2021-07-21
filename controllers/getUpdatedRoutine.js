const asyncHandler = require("../middleware/asyncHandler");

exports.getUpdatedRoutine = asyncHandler(async (req, res) => {

  const bulkWriteResultsData = res.bulkWriteResultsData

    if(req.body.bulkWriteResultsData){
      return res
      .status(200)
      .json({...res.advancedResults, bulkWriteResultsData});
    }
  
    return res
      .status(200)
      .json(res.advancedResults);
    
});
