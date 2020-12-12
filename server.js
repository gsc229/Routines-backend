const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const colors = require('colors')
const connectDB = require('./config/db')

// Load env variablse
dotenv.config({path: './config/config.env'})


// Connect to database
connectDB()

// Route files

// start the app
const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`\n *** LISTENING ON PORT ${PORT} ***\n`.yellow.bold))