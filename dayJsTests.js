const dayjs = require('dayjs')

const day = dayjs("2021-08-21T07:20:00.000Z")
const shortDayFormat = day.day()

console.log({shortDayFormat})