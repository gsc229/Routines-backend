const advancedQuery = (model, populate) => async (req, res, next) => {
  // check to see if the advancedQuery can be bypassed, if it can call next() 
  // bypass condition vars
  const noQuery = Object.entries(req.query).length < 1 
  if(noQuery){
    res.bypass = {noQuery}
    next()
  }


  //if not...
  let query;

  const reqQuery = { ...req.query }


  
  
  // analyze the query string
  /* separate out the actual query statements like name, price, type, etc. 
    from the non-query statements like select, page, limit, sort, populate, popselect, nest, nestselect etc.  */
  const removeFields = ['select', 'sort', 'limit', 'page', 'populate', 'next', 'popselect', 'nestselect']
  removeFields.forEach(param => delete reqQuery[param])
  // query the databse
  // apply the methods
  // attch advancedResults object to the response
  // call next
  

  console.log(model)

  res.advancedResults = {
    message: "Here's your advance results.",
    query,
    reqQuery,
    fullQuery: req.query
  }
  next()

}


module.exports = advancedQuery