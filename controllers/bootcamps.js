const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')



// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootCamps = async (req, res, next) => {
    try {
        const  bootcamps = await Bootcamp.find()
        res.status(200)
            .json({
                success: true,
                count: bootcamps.length,
                data: bootcamps
            })
    } catch (err) {
        next(err)
    }
};




// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootCamp = async (req, res, next) => {
    try {
        const  bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp) {
           return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({success: true, data: bootcamp})
    } catch (err) {
        next(err)
    }
};


// @desc create a bootcamp
// @route POST /api/v1/bootcamps/
// @access Private
exports.createBootCamp = async  (req, res, next) => {

    try {
        const bootcamp =  await Bootcamp.create(req.body)
        res.status(200)
            .json({
                success: true,
                data: bootcamp
            })
    } catch (err) {
        next(err)

    }



};


// @desc Update a bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Private
exports.updateBootCamp = async (req, res, next) => {
    try {
        const bootcamp =  await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        })

        if(!bootcamp) {
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200)
            .json({
                success: true,
                data: bootcamp
            })


    } catch (err) {
        next(err)
    }
};


// @desc Delete a bootcamp
// @route DELETE /api/v1/bootcamps/
// @access Private
exports.deleteBootCamp = async (req, res, next) => {
    try {
        const bootcamp =  await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp) {
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200)
            .json({
                success: true,
                data: {}
            })

    } catch (err) {
        next(err)
    }
};




