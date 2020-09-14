const ErrorResponse = require('../utils/errorResponse');
const Reviews = require('../models/Reviews');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');


// @desc Get all reviews and associated bootcamps
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public

exports.getReviews = asyncHandler(async (req, res, next) => {

    if(req.params.bootcampId) {
        const reviews = await Reviews.find({bootcamp: req.params.bootcampId}).populate({
            path: 'bootcamp',
            select: 'name description'
        });


        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })

    }else  {
        res.status(200).json(res.advanceResults)

    }

});


// @desc Get a single review
// @route GET /api/v1/review/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const  review = await Reviews.findById(req.params.id).populate({
        path: 'bootcamp',
        select: ' name description'
    });

    if(!review) {
        return  next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: review})

});



// @desc Create a review
// @route POST /api/v1/reviews
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access private
exports.createReview = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const  bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }

    const review =  await Reviews.create(req.body);
    res.status(200)
        .json({
            success: true,
            data: review
        })

});



// @desc Update a review
// @route PUT /api/v1/review/:id
// @access Private
exports.updateReview = asyncHandler( async (req, res, next) => {


    //remove user from the request
    delete  req.body.user;

    let review =  await Reviews.findByIdAndUpdate(req.params.id);

    if(!review) {
        return  next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404))
    }

    if(checkOwnerShip(review.user.toString(), req))  return next(new  ErrorResponse('UnAuthorised Action', 403));

    review =  await Reviews.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    res.status(200)
        .json({
            success: true,
            data: review
        })
});


// @desc Delete a review
// @route DELETE /api/v1/review/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    let review =  await Reviews.findById(req.params.id); //findByIdAndDelete does not trigger deletes

    if(!review) {
        return  next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404))
    }
    if(checkOwnerShip(review.user.toString(), req))  return next(new  ErrorResponse('UnAuthorised Action', 403));

    await Reviews.findByIdAndDelete(req.params.id); //findByIdAndDelete does not trigger deletes

    res.status(200)
        .json({
            success: true,
            data: {}
        })
});

const checkOwnerShip = (ownerId, req) => {
    return ownerId !== req.user.id && req.user.role !== 'admin'
};
