const errorHandler = (err, req, res, next) => {
    //Log The Error
    console.log(err.stack)
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message  || 'Server Error'
    })
}

module.exports = errorHandler

