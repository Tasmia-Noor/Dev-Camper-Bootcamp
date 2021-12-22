const ErrorResponse = require("../utils/errorResponse");

// Error handler middleware

const errorHandler = (err , req, res, next)=>{
// console.log(err);
    let error = { ...err }
    error.message = err.message

    console.log(err.stack.red);

    // console.log(err.name)
    // Mongoose bad objectid error
    if (err.name=== "CastError")
    {
        const message = `Resource is not found with id of ${err.value}`
        error = new ErrorResponse(message, 400)
    }

    // Mongoose duplicated name error
    if(err.code === 11000){
        message = "Duplicate Bootcamp name Error"
        error = new ErrorResponse(message, 400)
    }

     // Mongoose empty field error
     if(err.name === "ValidationError"){
        message = Object.values(err.errors).map(val=>val.message)
        error = new ErrorResponse(message, 400)
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'server error'
    })
}
module.exports = errorHandler