const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');




// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
   // console.log(req.query)

    let query;

    //copy of request query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete for request query
   removeFields.forEach(param => delete reqQuery[param]);

    //console.log(reqQuery)

    let queryStr = JSON.stringify(reqQuery);


    //creating  operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);


     query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

     //Selection fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }


    // Sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }else  {
        query = query.sort('-createdAt');
    }

    // Pagination
    const  page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit,10) || 100;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();


    query = query.skip(startIndex).limit(limit);

    //Execute Query
    const  bootcamps = await query;

    //Pagination Result
    const  pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }


    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }


        res.status(200)

            .json({
                success: true,
                count: bootcamps.length,
                pagination,
                data: bootcamps
            });
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






