const populateQuery = (reqDotQuery) => {
  // Routine --> Week --> Routine_Exercise --> Exercise
  let {
    populate_one,
    populate_two,
    populate_three,
    populate_four,
    select_one,
    select_two,
    select_three,
    select_four,
  } = reqDotQuery;

  if (!populate_one) return "";

  const populate = {};
  
  populate.path = populate_one ? populate_one : ""; // weeks
  select_one ? (select_one = select_one.split(",").join(" ")) : "";
  populate.select = select_one ? select_one : "";
  
  
  if (!populate_two) return populate;

  populate.populate = {};
  populate.populate.path = populate_two ? populate_two : ""; // set_groups
  select_two ? (select_two = select_two.split(",").join(" ")) : "";
  populate.populate.select = select_two ? select_two : "";

  if (!populate_three) return populate;

  populate.populate.populate = {};
  populate.populate.populate.path = populate_three ? populate_three : ""; // exercises_sets
  select_three ? (select_three = select_three.split(",").join(" ")) : "";
  populate.populate.populate.select = select_three ? select_three : "";

  if (!populate_four) return populate;

  populate.populate.populate.populate = {};
  populate.populate.populate.populate.path = populate_four ? populate_four : ""; // exercises
  select_four ? (select_four = select_four.split(",").join(" ")) : "";
  populate.populate.populate.populate.select = select_four ? select_four : "";

  return populate;
};

module.exports = populateQuery;
