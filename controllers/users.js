const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');



// @desc  Get all user
// @route GET /api/v1/auth/users
// @access Private Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200)
        .json(res.advanceResults);
});


// @desc  Get a single user
// @route GET /api/v1/auth/users/:id
// @access Private Admin
exports.getUser = asyncHandler(async (req, res, next) => {
   const user =  await  User.findById(req.params.id).populate('bootcamps');

    if(!user) {
        return  next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data: user})

});


// @desc  Add a single user
// @route POST /api/v1/auth/users/
// @access Private Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const  {name, email, password, role } = req.body;

    //Create a user
    const user = await User.create({
        name,
        password,
        email,
        role
    });

    res.status(200).json({success: true, data: user})

});

// @desc  Update a user
// @route PUT /api/v1/auth/users/:id
// @access Private Admin
exports.updateUser = asyncHandler(async (req, res, next) => {


    let user = await User.findById(req.params.id);

    if(!user) {
        return  next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

     user =  await User.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    res.status(200).json({success: true, data: user})

});



// @desc  Delete a user
// @route PUT /api/v1/auth/users/:id
// @access Private Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

     let user = await User.findById(req.params.id);

    if(!user) {
        return  next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({success: true, data: {}})

});