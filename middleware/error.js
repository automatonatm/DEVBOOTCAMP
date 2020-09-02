
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {


    console.log(err)
    let error = {...err};

    error.message = err.message;
    //Log The Error
    //Mongoose Bad object Id
    if(err.name === 'CastError') {
        const  message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404)
    }

    // Mongoose Validation error
    if(err.name === 'ValidationError') {
        const  message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    if(err.code === 11000) {
        const  message = `Duplicate(s) value found, Check and try again`;
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message  || 'Server Error'
    })
}

module.exports = errorHandler

