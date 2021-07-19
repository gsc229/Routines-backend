const populateBuilder = require('../helpers/populateQuery')

const advancedQuery = (model, populate) => async (req, res, next) => {
  
  //first parameter will be ids for the model to be queried, no need to know exerciseId, routineId etc., just put it in the query object as _id
  if(Object.entries(req.params).length && !req.query._id){
    console.log(Object.entries(req.params))
    req.query._id = Object.entries(req.params)[0][1]
  }
  console.log({"req.query": req.query})
  const reqQuery = { ...req.query }
  // remove non-search fields
  const removeFields = [
    'select', 
    'sort', 
    'limit', 
    'page', 
    'populate_one', 
    'populate_two', 
    'populate_three', 
    'populate_four', 
    'select_one', 
    'select_two',
    'select_three',
    'populate_weeks',
    'populate_set_groups',
    'populate_exercise_sets',
    'populate_exercises',
    'populate_exercise_sets_exercise'
  ]

  removeFields.forEach(field => delete reqQuery[field])

  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  
  
  let query = model.find(JSON.parse(queryStr))
  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */


  if(req.query.select){
    let fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // nested populate
  let nestedPopulate = populateBuilder(req.query)

  if(nestedPopulate) query = query.populate(nestedPopulate)

  // first level populate
  if(req.query.populate_weeks){
    query = query.populate('weeks')
  }

  if(req.query.populate_set_groups){
    query = query.populate('set_groups')
  }

  if(req.query.populate_exercise_sets){
    query = query.populate('exercise_sets')
  }

  if(req.query.populate_exercise_sets_exercise){
    query = query.populate({
      path: 'exercise_sets',
      populate: {
        path: 'exercise'
      }
    })
  }

  if(req.query.populate_exercises){
    query = query.populate('exercises')
  }

  // 
  populate = ""
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
  const database_resource_count = await model.countDocuments()
  const total_pages = database_resource_count > limit ? Math.ceil(database_resource_count / limit) : 1

  query = query.skip(startIndex).limit(limit)

  const pagination = {
    database_resource_count,
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

  if(endIndex < database_resource_count){
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
      const size = new TextEncoder().encode(JSON.stringify(results)).length
      const kb = (size / 1025).toFixed(2)
      const mb = (kb / 1025).toFixed(2)
      pagination.total_results = results.length,
      res.advancedResults = {
        success: true,
        size,
        kb,
        mb,
        pagination,
        data: results
        
      }
      return next()
    }

    return res.status(500).send({success: false, error_message: "Your request could not be processed."})

  })

}


module.exports = advancedQuery