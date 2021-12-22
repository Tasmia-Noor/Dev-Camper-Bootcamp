const express = require('express')
const Courses = require('./courses')
const Reviews = require('./reviews')
const router = express.Router()
const {protect, authorize} = require('../Middleware/auth')
const advancedResult = require('../Middleware/advancedResult')
const Bootcamp = require('../Model/bootcamp')


// All Bootcamps
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius,bootcampPhotoUpload} = require('../Controllers/Bootcamps')
router.use('/:bootcampId/courses', Courses)
router.use('/:bootcampId/reviews', Reviews)


router.route('/')
.get(advancedResult(Bootcamp, 'Courses'),getBootcamps)
.post(protect,authorize("admin", "publisher"), createBootcamp)


router.route('/:id')
.get(getBootcamp)
.put(protect,authorize("admin", "publisher"), updateBootcamp)
.delete(protect,authorize("admin", "publisher"), deleteBootcamp)

router.route('/:id/photo')
.put(protect,authorize("admin", "publisher"), bootcampPhotoUpload)

router.route('/radius/:zipcode/:distance')
.get(getBootcampsInRadius);

module.exports = router




// Routes
// router.get('/',(req,res)=>{
//     res.status(200).json({success:true , msj:"show all bootcamps"})
// })

// router.get('/:id',(req,res)=>{
//     res.status(200).json({success:true , msj:`show bootcamp ${req.params.id}`})
// })

// router.post('/',(req,res)=>{
//     res.status(200).json({success:true , msj:"create a new bootcamp"})
// })

// router.put('/:id',(req,res)=>{
//     res.status(200).json({success:true , msj:`update bootcamp ${req.params.id}`})
// })

// router.delete('/:id',(req,res)=>{
//     res.status(200).json({success:true , msj:`Delete bootcamp ${req.params.id}`})
// })
