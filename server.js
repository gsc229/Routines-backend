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

// Logging middleware
if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'))
}

// Bring the route files to pass the entry point routes of each resource

// Initiate the app
const app = express()

// Body parser
app.use(express.json())

// Set security headers
app.use(helmet())

// Enable CORS
app.use(cors())

// Mount the routers

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`\n *** LISTENING ON PORT ${PORT} ***\n`.yellow.bold))

// Handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`.red);
});