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



// Bring the route files to pass the entry point routes of each resource
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const exerciseRoutes = require('./routes/exercises')
const routineRoutes = require('./routes/routines')
const setGroups = require('./routes/set_groups')
const exerciseSets = require('./routes/exercise_sets')
const queryTester = require('./routes/query_tester')

// Initiate the app
const app = express()

// Logging middleware
if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'))
}

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
app.use('/api/v1.0/routines', routineRoutes)
app.use('/api/v1.0/set-groups', setGroups)
app.use('/api/v1.0/exercise-sets', exerciseSets)
app.use('/api/v1.0/query-tester', queryTester)

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