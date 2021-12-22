const Bootcamp = require('../Model/bootcamp')
const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../Middleware/async')
const geocoder = require('../utils/geocoder')



// @description Get all bootcamps
// @Routes      Get /api/v1/bootcamps
// @acess       Public
exports.getBootcamps= asyncHandler( async(req,res, next)=>{
    res.status(200).json(res.advancedResult)
})




// @description Get single bootcamp
// @Routes      Get /api/v1/bootcamps/:id
// @acess       Public

exports.getBootcamp=asyncHandler( async(req,res, next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id).populate('Courses')
        res.status(200).json({success:true , data:bootcamp})
        if(!bootcamp){
            return res.status(400).json({success:false})
        }
    // catch(err){
    //     // res.status(400).json({success:false})
    //     next(err)
    //     // next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400))
    // }
})




// @description create new bootcamp
// @Routes      Post /api/v1/bootcamps
// @acess       Private

exports.createBootcamp=asyncHandler( async(req,res,next) =>{
    // Add user to req,body
   req.body.user = req.user.id

   // check for published  bootcamp
   const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

   // if the  user is not an admin , they  can only add one bootcamp
   if (publishedBootcamp && req.user.role !== 'admin')
   {
       return next(new ErrorResponse(`The  user  with  ID ${req.user.id}  has already published a bootcamp`, 400))
   }

   const bootcamp = await Bootcamp.create(req.body)

   res.status(200).json({success: true, data: bootcamp})

})




// @description Update bootcamp
// @Routes      Put /api/v1/bootcamps/:id
// @acess       Private

exports.updateBootcamp=asyncHandler( async(req,res,next) =>{
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp)
    {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }
 
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this bootcamp`,
                401
            )
        );
    }
 
        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        })
        res.status(200).json({success:true , data:bootcamp})
        if(!bootcamp){
            return res.status(400).json({success:false})
        }
})




// @description Delete bootcamp
// @Routes      Delete /api/v1/bootcamps/:id
// @acess       Private

exports.deleteBootcamp=asyncHandler( async(req,res,next) =>{
    
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this bootcamp`,
                401
            )
        );
    }
 
        
        bootcamp.remove()
        res.status(200).json({
            success: true,
            data: {}
        });
     
})





// @description upload photo of bootcamp
// @Routes      put /api/v1/bootcamps/:id/photo
// @acess       Private

exports.bootcampPhotoUpload=asyncHandler( async(req,res,next) =>{
    
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not find with the id of ${req.params.id}`, 404)
        )
    }
    if(!req.files){
        return next(
            new ErrorResponse(`please upload a photo`, 404)
        )
    }
    // console.log(req.files,'reqfile');
    const file = req.files.file
    console.log(file,'file');

    // make sure your photo is an image type
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`please upload an image file`, 400))
    }

    // make sure your photo size
    if(!file.size > process.env.Image_size){
        return next(new ErrorResponse(`please upload an image file less than ${process.env.Image_size} bytes`, 400))
    }

    // create custom file name
    file.name = `photo ${bootcamp._id}${path.parse(file.name).ext}`
    console.log(file.name);

    // creating folder, defining path and uploading photo
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err=>{
        if(err){
            console.log(err);
            return next(new ErrorResponse(`problem with file upload`,500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
    })
    return res.status(200).json({success:true, data:file.name})
})




exports.getBootcampsInRadius= asyncHandler(async(req,res,next)=>{
    const {zipcode, distance} = req.params

    // get lat/lang from geocoder
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;
   
   // Calc radius using radians
   // Divide dist by radius of Earth
   // Earth Radius = 3,963 mi / 6,378 km

   const radius = distance / 3963;
   const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
});

res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
});

})