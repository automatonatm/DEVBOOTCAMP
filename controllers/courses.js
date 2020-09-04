const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');


// @desc Get all bootcamps
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