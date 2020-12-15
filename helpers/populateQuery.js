const populateQuery = (reqDotQuery) => {
  // Routine --> Week --> Routine_Exercise --> Exercise 
  // Routine

  console.log({reqDotQuery})

  const populate = {}
  
  populate.path = reqDotQuery.populate_one ? reqDotQuery.populate_one : '' // weeks
  populate.select = reqDotQuery.select_one ? reqDotQuery.select_one : ''

  populate.populate = {}
  populate.populate.path = reqDotQuery.populate_two ? reqDotQuery.populate_two : '' // routine_exercises
  populate.populate.select = reqDotQuery.select_two ? reqDotQuery.select_two : ''
  
  populate.populate.populate = {}
  populate.populate.populate.path = reqDotQuery.populate_three ? reqDotQuery.populate_three : '' // exercises
  populate.populate.populate.select = reqDotQuery.select_three ? reqDotQuery.select_three : ''


  return populate

}

module.exports = populateQuery