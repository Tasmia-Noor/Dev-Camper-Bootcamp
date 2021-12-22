// auth protect middleware
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse')
const User = require('../Model/User');


// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
 
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    )
    {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
        // Set token from cookie
    }


    else if (req.cookies.token) {
      token = req.cookies.token;
    }
 
    // Make sure token exists
    if (!token)
    {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
 
    try
    {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
 
        req.user = await User.findById(decoded.id);
 
        next();
    }
    
    catch (err)
    {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
 });
 

//  only publisher and admin can del or edit
 exports.authorize = (...roles) => {
    //  console.log(roles, "roles");
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
        {
            return next(
                new ErrorResponse(
                    `${req.user.role} role is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
 }; 