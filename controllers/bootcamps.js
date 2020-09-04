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


     query = Bootcamp.find(JSON.parse(queryStr));

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






