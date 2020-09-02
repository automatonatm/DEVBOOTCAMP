
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
                data: bootcamps
            })
    } catch (err) {
        res.status(400)
            .json({
                success: false,
                error: err
            })
    }
};


// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootCamp = async (req, res, next) => {
    try {
        const  bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp) {
            return res.status(400)
                .json({
                    success: false,
                    msg: 'BootCamp do not exists'
                })
        }
        res.status(200)
            .json({
                success: true,
                data: bootcamp
            })
    } catch (err) {
        console.log(err)
        res.status(400)
            .json({
                success: false,
                error: err
            })
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
        res.status(400)
            .json({
                success: false,
                error: err
            })

    }



};


// @desc Update a bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Private
exports.updateBootCamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update Bootcamp ${req.params.id}`})
};


// @desc Delete a bootcamp
// @route DELETE /api/v1/bootcamps/
// @access Private
exports.deleteBootCamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete Bootcamp ${req.params.id}`})
};




