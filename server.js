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
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const exerciseRoutes = require('./routes/exercises')
const routineExercises = require('./routes/routine_exercises')

// Initiate the app
const app = express()

// Body parser
app.use(express.json())

// Set security headers
app.use(helmet())

// Enable CORS
app.use(cors())

// Mount the routers (/api/v.1/<resource>)
app.use('/api/v1.0/auth', authRoutes)
app.use('/api/v1.0/users', userRoutes)
app.use('/api/v1.0/exercises', exerciseRoutes)
app.use('/api/v1.0/routine-exercises', routineExercises)

// test route
app.get('/test', (req, res) => {
  res.send(
    '<h1>Server Status</h1><h2>Server running succesfully.</h2><p>Deployment is all good, continue working.. nothing to see here.</p>'
  );
});

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`\n *** LISTENING ON PORT ${PORT} ***\n`.yellow.bold))

// Handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`.red);
});