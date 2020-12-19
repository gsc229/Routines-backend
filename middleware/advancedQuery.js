const populateBuilder = require('../helpers/populateQuery')

const advancedQuery = (model, populate) => async (req, res, next) => {
  
  if(Object.entries(req.params).length && !req.query._id){
    console.log(Object.entries(req.params))
    req.query._id = Object.entries(req.params)[0][1]
  }

  console.log("req.params\n",req.params)
  console.log("req.query\n",req.query)
  console.log("req.headers", req.headers)

  const reqQuery = { ...req.query }
  // remove non-search fields
  const removeFields = ['select', 'sort', 'limit', 'page', 'populate_one', 'populate_two', 'populate_three', 'select_one', 'select_two','select_three']
  removeFields.forEach(param => delete reqQuery[param])

  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  let query = model.find(JSON.parse(queryStr))
  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
  if(req.query.select){
    let fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  const populate = populateBuilder(req.query)

  console.log(populate)

  query = query.populate(populate)

  if(req.query.sort){
    let sortBy = req.query.sort
    query = query.sort(sortBy)
  } else{
    query = query.sort("-created_at")
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 75
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const total__entries = await model.countDocuments()
  const total_pages = total__entries > limit ? Math.ceil(total__entries / limit) : 1

  query = query.skip(startIndex).limit(limit)
  
  //const results = await query
  /* ^^^^^^^^^^^^^^^^^^^^^^^^ */
  const pagination = {
    total__entries,
    total_pages,
    next: {
      page: null,
      limit: null
    },
    prev: {
      page: null,
      limit: null
    }
  }

  if(endIndex < total__entries){
    pagination.next = {
      page: page + 1,
      limit
    }
  } 

  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  query.exec((err, results) => {
    if(err){
     return res.status(400).send({success: false, error_message: err.message, err_name: err.name})
    }

    if(results){
      pagination.total_results = results.length,
      res.advancedResults = {
        success: true,
        data: results,
        pagination
      }
      return next()
    }

    return res.status(500).send({success: false, error_message: "Your request could not be processed."})

  })


  

}


module.exports = advancedQuery