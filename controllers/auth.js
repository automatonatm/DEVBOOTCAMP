const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc  Register user
// @route GET /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
    const  {name, email, password, role } = req.body

    //Create a user
    const user = await User.create({
        name,
        password,
        email,
        role
    });

    res.status(200)
        .json({
            success: true,
        })

});


// @desc  Login user
// @route GET /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    res.status(200).json({success: true});
});