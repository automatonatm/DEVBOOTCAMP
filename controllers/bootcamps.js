const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');




// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
   // console.log(req.query)


        res.status(200)

            .json(res.advanceResults);
});



// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
    const  bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
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
    const bootcamp =  await Bootcamp.findById(req.params.id); //findByIdAndDelete does not trigger deletes
    if(!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    bootcamp.remove();

    res.status(200)
        .json({
            success: true,
            data: {}
        })
});


// @desc Get Bootcamps with a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
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

// @desc Upload photo for a bootcamp
// @route DELETE /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp =  await Bootcamp.findById(req.params.id); //findByIdAndDelete does not trigger deletes
    if(!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }




    if(!req.files) {
        return  next(new ErrorResponse('Please Upload a file', 400))
    }

    const file = req.files.file;

    //check if file is a photo
    if (!file.mimetype.startsWith('image'))  {
        return  next(new ErrorResponse('Please Upload an image file', 400))
    }

    //check file size
    if(file.size >  process.env.MAX_FILE_UPLOAD) {
        return  next(new ErrorResponse(`Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    //Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {

        if(err) {
            return  next(new ErrorResponse('There was a problem while uploading photo', 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name}, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: bootcamp
        })


    });



});






