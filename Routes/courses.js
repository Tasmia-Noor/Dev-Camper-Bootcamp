const express = require('express')
const router = express.Router({mergeParams: true})
const {protect, authorize} = require('../Middleware/auth')


const { getCourses,getCourse,addCourse,updateCourse,deleteCourse } = require('../Controllers/courses')

router.route('/')
.get(getCourses)
.post(protect,authorize("admin", "publisher"), addCourse)


router.route('/:id')
.get(getCourse)
.put(protect,authorize("admin", "publisher"), updateCourse)
.delete(protect,authorize("admin", "publisher"), deleteCourse)

module.exports = router 
