const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');



// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    //console.log(req.query)

    let query
    let queryStr = JSON.stringify(req.query)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    console.log(queryStr)
        const  bootcamps = await Bootcamp.find();
        res.status(200)
            .json({
                success: true,
                count: bootcamps.length,
                data: bootcamps
            })
});



// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
    const  bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data: bootcamp})
});


// @desc create a bootcamp
// @route POST /api/v1/bootcamps/
// @access Private
exports.createBootCamp = asyncHandler(async  (req, res, next) => {
    const bootcamp =  await Bootcamp.create(req.body);
    res.status(200)
        .json({
            success: true,
            data: bootcamp
        })

});


// @desc Update a bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Private
exports.updateBootCamp = asyncHandler( async (req, res, next) => {
    const bootcamp =  await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    if(!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200)
        .json({
            success: true,
            data: bootcamp
        })
});



// @desc Delete a bootcamp
// @route DELETE /api/v1/bootcamps/
// @access Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp =  await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200)
        .json({
            success: true,
            data: {}
        })
});


// @desc Get Bootcamps with a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootCampsInRedius = asyncHandler(async (req, res, next) => {
    const  {zipcode, distance} = req.params;
    //Get lat/lon from geocode
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lon = loc[0].longitude;


    //calculate the radius
    //Divide distance / radius of earth(3,963 mi | 6,378)
    const radius = distance/3963

    const bootcamps = await Bootcamp.find({
        location:  { $geoWithin: {$centerSphere: [ [lon, lat], radius] } }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })


});






