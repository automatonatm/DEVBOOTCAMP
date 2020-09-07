

const express  = require('express');
const  router  = express.Router();

const  {
    getBootCamps,
    getBootCamp,
    createBootCamp,
    updateBootCamp,
    deleteBootCamp,
    getBootCampsInRadius,
    bootcampPhotoUpload

}  = require('../controllers/bootcamps');


const Bootcamp  = require('../models/Bootcamp');
const advanceResults = require('../middleware/advanceResults');

//Include other resources routers
const  courseRouter = require('./courses');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .post(createBootCamp)
    .get(advanceResults(Bootcamp, 'courses'), getBootCamps);


router.route('/:id')
    .get(getBootCamp)
    .put(updateBootCamp)
    .delete(deleteBootCamp);

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);


module.exports = router;