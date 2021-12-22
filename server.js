const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const path = require('path')
const fileuploader = require('express-fileupload')
const cookieParser = require('cookie-parser')
const cors = require('cors')
// for API security
const mongoSanitize = require('express-mongo-sanitize');
// website/ http security
const helmet = require('helmet');
// Cross-Site Scripting (XSS) attacks
var xss = require('xss-clean')
// to limit requests on server
const rateLimit = require('express-rate-limit');



// load env var
dotenv.config({path: './config/config.env'})
// Routes File
const bootcamps = require ('./Routes/Bootcamps')
const auth = require('./Routes/auth')
const users = require('./Routes/users')
const courses = require('./Routes/courses')

const reviews = require('./Routes/reviews')
// middleware File
const logger = require('./Middleware/logger')
const errorHandler = require('./Middleware/Error')
const morgan = require('morgan')
// DB File
const connectDB = require('./config/db')

connectDB()


const app = express()


// connect postman with our backend
app.use(express.json())
// cookie parser
app.use(cookieParser())
// Api security
app.use(mongoSanitize());
// set security header
app.use(helmet());
// prevent xss attacks
app.use(xss())


// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
 });
 app.use(limiter);
// to attach with frontend
app.use(cors())
 

// Dev logging Middleware
if(process.env.NODE_ENV==="development")
{
    app.use(morgan('dev'))
}

app.use(fileuploader())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// middleware function
// app.use(logger)

// for bootcamps
app.use('/api/v1/bootcamps', bootcamps)
// for user
app.use('/api/v1/auth',auth)
// for admin
app.use('/api/v1/users',users)
// for courses
app.use('/api/v1/courses', courses)
// for reviews
app.use('/api/v1/reviews', reviews)

app.use(errorHandler)




// define port
const PORT = process.env.PORT || 6060
const server = app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`.blue.bold);
})

// handle unhandle promiss rejection
process.on('unhandledRejection',(err,Promise)=>{
    console.log(`Error: ${err.message}`.red);
    // close server & exit process
    server.close(()=>process.exit(1))
})