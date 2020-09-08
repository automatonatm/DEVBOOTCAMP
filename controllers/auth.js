const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc  Register user
// @route POST /api/v1/auth/register
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

    //Create a token
    const token = user.getSignedJwtToken();

    res.status(200)
        .json({
            success: true,
            token
        })

});


// @desc  Login user
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const  {email, password} = req.body;

    //validate email and password
    if(!email || !password) return next(new ErrorResponse('Please fill all form Fields', 400));

    //check for user
    const user = await User.findOne({email}).select('+password');

    if(!user) return next(new ErrorResponse('Invalid Credentials', 401));

    //check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    const token = user.getSignedJwtToken();



    res.status(200).json({success: true, token});
});