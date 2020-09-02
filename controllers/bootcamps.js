

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootCamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'})
};


// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootCamp = (req, res, next) => {
     res.status(200).json({success: true, msg: `Show Bootcamp ${req.params.id}`})
};


// @desc create a bootcamp
// @route POST /api/v1/bootcamps/
// @access Private
exports.createBootCamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Create Bootcamp`})
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




