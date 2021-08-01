const populateFirstLevel = (reqDotQuery) => {

  let {
    populate_weeks,
    populate_week,
    select_weeks,
    select_week,
    populate_set_groups,
    populate_set_group,
    select_set_groups,
    select_set_group,
    populate_exercise_sets,
    populate_exercises,
    populate_exercise,
    select_exercise,
    select_exercises,
    select_exercise_sets,
    populate_routine,
    select_routine,
    populate_exercise_sets_exercise,
    select_exercise_sets_exercise,
  } = reqDotQuery

  // first-level (flat) populates and selects
  const flatPopulates = []
  
  if (populate_weeks) {
    flatPopulates.push({
      path: "weeks",
      select: select_weeks
        ? select_weeks.split(",").join(" ")
        : "",
    });
  }

  if (populate_set_groups) {
    flatPopulates.push({
      path: "set_groups",
      select: select_set_groups
        ? select_set_groups.split(",").join(" ")
        : "",
    });
  }

  if (populate_exercise_sets) {
    flatPopulates.push({
      path: "exercise_sets",
      select: select_exercise_sets
        ? select_exercise_sets.split(",").join(" ")
        : "",
    });
  }

  if (populate_exercise_sets_exercise) {
    flatPopulates.push({
      path: "exercise_sets",
      select: select_exercise_sets
        ? select_exercise_sets.split(",").join(" ")
        : "",
      populate: {
        path: "exercise",
        select: select_exercises
          ? select_exercises.split(",").join(" ")
          : select_exercise_sets_exercise
          ? select_exercise_sets_exercise.split(",").join(" ")
          : "",
      },
    });
  }

  if (populate_exercises) {
    flatPopulates.push({
      path: "exercises",
      select: select_exercises
        ? select_exercises.split(",").join(" ")
        : "",
    });
  }

  if (populate_exercise) {
    flatPopulates.push({
      path: "exercise",
      select: select_exercise
        ? select_exercise.split(",").join(" ")
        : "",
    });
  }

  if (populate_week) {
    console.log("POPULATE WEEK".red, JSON.stringify(reqDotQuery, null, 2).blue)
    flatPopulates.push({
      path: "week",
      select: select_week
        ? select_week.split(",").join(" ")
        : "",
    });
  }

  if (populate_set_group) {
    flatPopulates.push({
      path: "set_group",
      select: select_set_group
        ? select_set_group.split(",").join(" ")
        : "",
    });
  }

  if (populate_routine) {
    flatPopulates.push({
      path: "routine",
      select: select_routine
        ? select_routine.split(",").join(" ")
        : "",
    });
  }

  return flatPopulates.length > 0 ? flatPopulates : ""
};

module.exports = populateFirstLevel;