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


    sendTokenResponse(user, 200, res)

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

     sendTokenResponse(user, 200, res)
});

// @desc  Get Current logged in User
// @route POST /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    return res.status(200)
        .json({
            success: true,
            data: user
        })
});


//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create Token
    const token = user.getSignedJwtToken();

     const options = {
         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 *   60 * 60 * 1000 ),
         httpOnly: true
     };

     if(process.env.NODE_ENV === 'production') options.httpOnly = true;

     res.status(statusCode)
         .cookie('token', token, options)
         .json({success: true, token})
};


