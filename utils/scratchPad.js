const fromSchema_RoutineWeek = 
{sunday: {
  exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
  notes: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  }
},
monday: {
  exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
  notes: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  }
},
tuesday: {
  exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
  notes: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  }
},
wednesday: {
  exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
  notes: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  }
},
thursday: {
  exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
  notes: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  }
},
friday: {
  exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
  notes: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  }
},
saturday: {
  exercises: [{type: mongoose.Types.ObjectId, ref: "RoutineExercise"}],
  notes: {
    type: String,
    maxlength: [500, "Cannot exceed 50 characters"],
    minlength: [3, "Cannot be less than 3 characters"]
  }
}}