const  express = require('express');
const  dotenv = require('dotenv');
const morgan = require('morgan')

//Middlewares
const errorHandler = require('./middleware/error')


//DB connection
const connectDB = require('./config/db')

// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');



// Load env
dotenv.config({path: '.env'});

// Connect to Database
connectDB();

//init app
const app = express();


//Body Parser
app.use(express.json())



//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);  //Bootcamps Router
app.use('/api/v1/courses', courses); //Course Router


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running  on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//comment


//Handle Rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error, ${err.message}`)
    server.close(() => process.exit(1))

});
