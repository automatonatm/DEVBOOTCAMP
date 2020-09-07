

const express  = require('express')
const  router  = express.Router()

const  {
    getBootCamps,
    getBootCamp,
    createBootCamp,
    updateBootCamp,
    deleteBootCamp,
    getBootCampsInRadius,
    bootcampPhotoUpload

}  = require('../controllers/bootcamps');


//Include other resources routers
const  courseRouter = require('./courses')

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/')
    .post(createBootCamp)
    .get(getBootCamps);


router.route('/:id')
    .get(getBootCamp)
    .put(updateBootCamp)
    .delete(deleteBootCamp);

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);


module.exports = router;