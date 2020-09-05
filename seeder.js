const fs = require('fs');
const  mongoose = require('mongoose');

const  dotenv = require('dotenv');



// Load env
dotenv.config({path: '.env'});

//Load Models
const Bootcamp = require('./models/Bootcamp');
const Courses = require('./models/Course');

//connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:  true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
});

//Read Json file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

//import into db

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
       // await Courses.create(courses);
        console.log('Data imported....');
        process.exit()
    } catch (err) {
        console.error((err))
    }
};

//Delete Data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Courses.deleteMany();
        console.log('Data Destroyed....');
        process.exit()
    } catch (err) {
        console.error((err))
    }
};


if(process.argv[2] === '-i') {
    importData()
}else  if(process.argv[2] === '-d') {
    deleteData()
}