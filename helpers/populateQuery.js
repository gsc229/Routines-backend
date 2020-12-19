const populateQuery = (reqDotQuery) => {
  // Routine --> Week --> Routine_Exercise --> Exercise 
  let {populate_one, populate_two, populate_three, select_one, select_two, select_three} = reqDotQuery

  

    select_one ? select_one = select_one.split(',').join(' ') : ''
    select_two ? select_two = select_two.split(',').join(' ') : ''
    select_three ? select_two = select_three.split(',').join(' ') : ''
    console.log({select_one, select_two, select_three})
  

  const populate = {}
  
  populate.path = populate_one ? populate_one : '' // weeks
  populate.select = select_one ? select_one : ''

  populate.populate = {}
  populate.populate.path = populate_two ? populate_two : '' // routine_exercises
  populate.populate.select = select_two ? select_two : ''
  
  populate.populate.populate = {}
  populate.populate.populate.path = populate_three ? populate_three : '' // exercises
  populate.populate.populate.select = select_three ? select_three : ''


  return populate

}

module.exports = populateQuery