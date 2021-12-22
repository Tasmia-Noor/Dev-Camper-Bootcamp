const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// load env vars
dotenv.config({path: "./config/config.env"})
// load models
const Bootcamp = require('./Model/bootcamp')
const Course = require('./Model/course')
const User = require('./Model/User')
const Reviews = require('./Model/reviews')

// connect to db
mongoose.connect(process.env.MONGO_URL)
// read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));

// import bootcamp to db
const importData= async()=>{
    try{
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        await Reviews.create(reviews)
        console.log('Data imported........'.green.inverse);
        process.exit(1)
    }
    catch(err){
        console.log(err);
    }
}

// delete bootcamp from db
const deleteData =async ()=>{
    try{
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Reviews.deleteMany()
        console.log('Data destroyed....'.red.inverse);
        process.exit(1)
    }
    catch(err){
        console.log(err);
    }
}


// give arguments
if(process.argv[2]==='-i'){
    importData()
}
else if(process.argv[2]==='-d'){
    deleteData()
}