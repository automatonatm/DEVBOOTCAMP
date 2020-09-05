const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');


// @desc Get all courses and associated bootcamps
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
// console.log(req.query)
    let query;

    if(req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId}).populate({
            path: 'bootcamp',
            select: 'slug name description'
        })
    }else  {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'slug name description'
        })
    }
    const  courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })

});




// @desc Create a course
// @route POST /api/v1/courses
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.createCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    const  bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }

    const course =  await Course.create(req.body);
    res.status(200)
        .json({
            success: true,
            data: course
        })

});


// @desc Get a single course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const  course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: ' name description'
    });

    if(!course) {
        return  next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: course})

});


// @desc Update a course
// @route GET /api/v1/course/:id
// @access Private
exports.updateCourse = asyncHandler( async (req, res, next) => {
    const course =  await Course.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    if(!course) {
        return  next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }
    res.status(200)
        .json({
            success: true,
            data: course
        })
});


// @desc Delete a bootcamp
// @route DELETE /api/v1/course/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course =  await Course.findByIdAndDelete(req.params.id); //findByIdAndDelete does not trigger deletes

    if(!course) {
        return  next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

    res.status(200)
        .json({
            success: true,
            data: {}
        })
});