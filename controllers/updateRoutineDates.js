const Routine =  require('../models/Routine')
const Weeks = require('../models/RoutineWeek')
const SetGroup = require('../models/SetGroup')
const ExerciseSet = require('../models/ExerciseSet')
const asyncHandler = require("../middleware/asyncHandler")
const dayjs = require('dayjs')
//console.log(dayjs('2021-08-22T00:00:00.000Z').diff(dayjs("2021-07-05T00:00:00.000Z"), 'days'))

/* @desc    Updates start_date for routine as well as all the routine's week_start_dates 
  as well as all weeks's set_groups scheduled_date as well as set_group's exercise_set scheduled date */
// @route   PUT /api/v1.0/update-routine-start-date/routineId
// @access  Private
exports.updateRoutineDates = asyncHandler(async (req, res, next) => {
  
  const routineId = req.params.routineId

  if(!req.body.start_date) return res.status(400).json({ success: false, message: 'You did not provide a new start_date.' })
  if(!dayjs(req.body.start_date).isValid()) return res.status(400).json({ success: false, message: `${req.body.start_date} is not a valid start date` })
  
  const newStartDate = dayjs(req.body.start_date) 

  const routine = await Routine.findByIdAndUpdate(routineId, { start_date: newStartDate.toISOString() }, { new: true })
  .populate( 'weeks')
  .populate('set_groups')
  .populate('exercise_sets')

  if(!routine) return res.status(404).json({ success: false, message: `No routine with id: ${routineId}` })

  const bulkWriteResultsData = []

  const weekBulkWrites = []
  const weekIdToNumberAndStartDate = {}
  
  routine.weeks.forEach(week => {
    const { _id } = week
    const week_number = parseInt(week.week_number)

    if(Number.isNaN(week_number) !== true && week_number > 0){
      const week_start_date = newStartDate.add(week_number - 1, 'week').toISOString()
      weekBulkWrites.push({ updateOne: { filter: { _id }, update: { week_start_date }}})
      weekIdToNumberAndStartDate[_id] = { week_number,  week_start_date }
    }

  })

  Weeks.bulkWrite(weekBulkWrites)
  .then(result => bulkWriteResultsData.push({ weeks: result }))
  .catch(error => res.status(500).json({ success: false, message: "Something went wrong trying to bulk write weeks.", error }))
  
  
  /* ========= set_groups =========== */
  const setGroupBulkWrites = []
  const setGroupIdToUpdateObject = {}

  routine.set_groups.forEach(set_group => {

    const { _id, week } = set_group // week = the _id of the week to which the set_group belongs
    const day_number = parseInt(set_group.day_number)
    const week_number = parseInt(set_group.week_number)

    if(Number.isNaN(week_number) !== true && Number.isNaN(day_number) !== true && day_number > 0){
      const update = {}
      update['scheduled_date'] = dayjs(weekIdToNumberAndStartDate[week]['week_start_date']).add(day_number - 1, 'day').toISOString()
      if(weekIdToNumberAndStartDate[week]['week_number'] !== week_number){
        update['week_number'] = weekIdToNumberAndStartDate[week]['week_number']
      } else update['week_number'] = week_number
      // cache the updates to use again for the exercise_set bulkwirtes --> they are more numerous, but are exactly the same updates as the set_groups
      setGroupIdToUpdateObject[_id] = update

      setGroupBulkWrites.push({ updateOne: { filter: { _id }, update }})
    }

  })
  
  SetGroup.bulkWrite(setGroupBulkWrites)
  .then(result => bulkWriteResultsData.push({ set_groups: result }))
  .catch(error => res.status(500).json({ success: false, message: "Something went wrong trying to bulk write set_groups.", error}))
  
  /* ========== exercise_sets ============= */
  
  const exerciseSetBulkWrites = []
  
  routine.exercise_sets.forEach(set => {
    const { _id, set_group } = set // set_group = the id of the set_group to which the exercise_set belongs
    // the updates should match the updates of the set_group
    exerciseSetBulkWrites.push({ updateOne: { filter: { _id }, update: setGroupIdToUpdateObject[set_group] }})
  })

  ExerciseSet.bulkWrite(exerciseSetBulkWrites)
  .then(result => bulkWriteResultsData.push({ exercise_sets: result }))
  .catch(error => res.status(500).json({ success: false, message: "Something went wrong trying to bulk write exercise_sets.", error}))

  if(req.query.send_bulkwrite_data) res.bulkWriteResultsData = bulkWriteResultsData
  

  next()


});


/* 
Character.bulkWrite([
  {
    insertOne: {
      document: {
        name: 'Eddard Stark',
        title: 'Warden of the North'
      }
    }
  },
  {
    updateOne: {
      filter: { name: 'Eddard Stark' },
      // If you were using the MongoDB driver directly, you'd need to do
      // `update: { $set: { title: ... } }` but mongoose adds $set for
      // you.
      update: { title: 'Hand of the King' }
    }
  },
  {
    deleteOne: {
      {
        filter: { name: 'Eddard Stark' }
      }
    }
  }
]).then(res => {
 // Prints "1 1 1"
 console.log(res.insertedCount, res.modifiedCount, res.deletedCount);
});


*/