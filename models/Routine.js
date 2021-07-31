const mongoose = require('mongoose')
const slugify = require('slugify')

const Routine_Schema = new mongoose.Schema({
    start_date: {
      type: Date,
      default: null
    },
    end_date: {
      type: Date,
      default: null
    },
    is_template: {
      type: Boolean,
      default: false
    },
    template_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Routine',
      default: null
    },
    public: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',  
      required: [true, "Needs the id of the current user"]
    },
    original_creator: {
      type: mongoose.Types.ObjectId,  
      required: [true, "Needs the id of the originial creator"], 
      ref: 'User'
    },
    copied_from: {
      type: mongoose.Types.ObjectId,
      ref: 'Routine',
      default: null
    },
    name: {
      type: String,
      required: [true, "Must provide a routine name"], 
      maxlength: [50, "Cannot exceed 50 characters"],
    },
    slug:{
      type: String
    },
    color: {
      type: String,
    },
    category: {
      type: String, 
      enum: ["Endurance", "Strength", "Flexibility", "Balance","", null],
      default: null
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Extreme", "", null],
      default: null
    },
    difficulty_scale: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    description: {
      type: String,
      maxlength: [500, "Cannot exceed 50 characters"],
      default: null
    },
    body_part: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      default: null
    },
    muscle_group: {
      type: String,
      enum: ["Chest", "Back", "Arms", "Shoulders", "Legs", "Calves", "Full Body", "Multiple Major Muscle Groups", null, ""],
      default: null
    },
    target_muscle: {
      type: String,
      maxlength: [50, "Cannot exceed 50 characters"],
      default: null
    }
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
  timestamps: true
})

/* ================ DELETE Cascading ======================= */
Routine_Schema.pre('deleteOne', {document:true, query: false}, async function(next){
  console.log(`DELETE Routine cascade RoutineWeek, SetGroup, ExerciseSet`)
  console.log({this: this, this_id: this._id})

  await this.model('RoutineWeek').deleteMany({
    routine: this._id
  })
  await this.model('SetGroup').deleteMany({
    routine: this._id
  })
  await this.model('ExerciseSet').deleteMany({
    routine: this._id
  })
  
  next()
})


/* =================== Populate Virtuals ================= */
Routine_Schema.virtual('weeks', {
  ref: 'RoutineWeek',
  localField: '_id',
  foreignField: 'routine',
  justOne: false
})

Routine_Schema.virtual('set_groups', {
  ref: 'SetGroup',
  localField: '_id',
  foreignField: 'routine',
  justOne: false
})

Routine_Schema.virtual('exercise_sets', {
  ref: 'ExerciseSet',
  localField: '_id',
  foreignField: 'routine',
  justOne: false
})



Routine_Schema.pre('save', function(next){
  this.slug = slugify(this.name, {
    lower: true,
    remove: /[*+.()'"!:@]/g
  })
  next()
})

Routine_Schema.pre('findOneAndUpdate', function(next){
  //console.log('SLUGIFY this:'.bgRed, this._update.slug, this._update.name)
  if(this._update.name && this._update.slug){
    this._update.slug = slugify(this._update.name, {
      lower: true,
      remove: /[*+.()'"!:@]/g
    })
  }
  
  next()
})

module.exports = mongoose.model('Routine', Routine_Schema)
