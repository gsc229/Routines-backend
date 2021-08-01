const nestPopulateBuilder = require("./helpers/nestPopulateBuilder");
const firstLevelPopulateBuilder = require("./helpers/firstLevelPopulateBuilder");
const advancedQueryBypass = require("./helpers/advancedQueryBypass");
const removeFields = require("./helpers/removeFields");

const advancedQuery = (model) => async (req, res, next) => {
  // first parameter will be ids for the model to be queried. Since we know the model, no need to know exerciseId, routineId etc.,
  // just put it in the query object as _id
  if (Object.entries(req.params).length && !req.query._id) {
    // doing it like this to be dynamic. There are many param id types, i.e. routineId, weekId etc.
    req.query._id = Object.entries(req.params)[0][1];
  }

  const reqQueryCopy = { ...req.query };
  // all fields not intened for the basic query (i.e. populate, sort, select etc.) must be added to ./helpers/removeFields
  removeFields.forEach((field) => delete reqQueryCopy[field]);

  let queryStr = JSON.stringify(reqQueryCopy);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  queryStr = JSON.parse(queryStr);

  let query = model.find(queryStr);
  /* ^^^^^^^^^^^^^^^^^ BASIC QUERY ^^^^^^^^^^^^^^^^^^^^^^^ */
  delete req.query._id;
  // if the only query/param field provided was the resource's id, then bypass the rest of advancedQuery
  // note: req.param.resourceId becomes req.query._id (see notes above)
  if (Object.keys(req.query).length === 0) {
    advancedQueryBypass(query, res, next);
  }
  // basic select for the target resource (i.e. /routines /routines/weeks /set-groups etc.)
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // nested populate
  const nestedPopulates = nestPopulateBuilder(req.query);
  if (nestedPopulates) query = query.populate(nestedPopulates);

  // first-level populates
  const firstLevelPopulates = firstLevelPopulateBuilder(req.query);
  if (firstLevelPopulates) query = query.populate(firstLevelPopulates);

  // sort
  if (req.query.sort) {
    let sortBy = req.query.sort;
    query = query.sort(sortBy);
  } else {
    query = query.sort("-created_at");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 75;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const database_resource_count = await model.countDocuments();
  const total_pages =
    database_resource_count > limit
      ? Math.ceil(database_resource_count / limit)
      : 1;

  query = query.skip(startIndex).limit(limit);

  const pagination = {
    database_resource_count,
    total_pages,
    next: {
      page: null,
      limit: null,
    },
    prev: {
      page: null,
      limit: null,
    },
  };

  if (endIndex < database_resource_count) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  query.exec((err, results) => {
    if (err) {
      return res.status(400).send({
        success: false,
        error_message: err.message,
        err_name: err.name,
      });
    }
    // the results are attached to the response and passed on to the appropriate resource controller 
    //which forwards the response to the client. (see the routes file of a given resource to see the response flow)
    if (results) {
      const size = new TextEncoder().encode(JSON.stringify(results)).length;
      const kb = (size / 1025).toFixed(2);
      const mb = (kb / 1025).toFixed(2);
      (pagination.total_results = results.length),
        (res.advancedResults = {
          success: true,
          size,
          kb,
          mb,
          pagination,
          data: results,
        });
      return next();
    }

    return res.status(500).send({
      success: false,
      error_message: "Your request could not be processed.",
    });
  });
}; /* END */

module.exports = advancedQuery;
