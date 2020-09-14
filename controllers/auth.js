const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendMail = require('../utils/sendEmail')
const crypto = require('crypto');



// @desc  Register user
// @route POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
    const  {name, email, password, role } = req.body;

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

// @desc  Logout / Clear Cookies
// @route POST /api/v1/auth/logout
// @access Private
exports.logOut = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    });

    return res.status(200)
        .json({
            success: true,
            data: {}
        })
});


// @desc  Get Current logged in User
// @route POST /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    return res.status(200)
        .json({
            success: true,
            data: user
        })
});

// @desc  Forgot Password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.setResetPasswordToken = asyncHandler(async (req, res, next) => {

    if(req.body.email === '')  return next(new ErrorResponse('Please provide an email', 422));

    const user = await User.findOne({email: req.body.email});

    if(!user)  return next(new ErrorResponse('User with this email not found', 404));

    //Get Reset Token
   const resetToken = await  user.getResetToken();

   await user.save({validateBeforeSave: false});

   //Create reset reset url

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `Click here to reset your password ${resetUrl}`;

    try {
        await sendMail({
            email:  user.email,
            subject: 'Password Reset Token',
            message
        })

        return res.status(200)
            .json({
                success: true,
                data: 'Email has been sent'
            })

    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpiredAt = undefined
        await user.save({validateBeforeSave: false});

        return next(new ErrorResponse('An Unknown Error Occurred, Please Try Again', 400));
    }




});


// @desc Reset password
// @route POST /api/v1/auth/resetpassword/:resettoken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    //Get Hashed token
    const resetPasswordToken  = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    //Find user by resettoken
    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpiredAt: {$gt: Date.now()}
    });


    if (!user) return next(new ErrorResponse('Invalid Token', 400));

    user.password =  req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiredAt = undefined;
    user.save();


    sendTokenResponse(user, 200, res)

});

// @desc  Update User details
// @route POST /api/v1/auth/updatedetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate  =  {
        name: req.body.name,
        email: req.body.email,
    }
    ;

    const user = await User.findByIdAndUpdate(req.user.id , fieldsToUpdate, {new: true, runValidators: true});

    return res.status(200)
        .json({
            success: true,
            data: user
        })
});

// @desc  Update user password
// @route PUT /api/v1/auth/updatepassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    //check if password matches
    if(! (await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Current Password is incorrect', 401));
    }

    user.password = req.body.password;
    user.save();

    sendTokenResponse(user, 200, res)

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


