

const express  = require('express')
const  router  = express.Router()

const  {
    getBootCamps,
    getBootCamp,
    createBootCamp,
    updateBootCamp,
    deleteBootCamp,
    getBootCampsInRedius
}  = require('../controllers/bootcamps');


router.route('/')
    .post(createBootCamp)
    .get(getBootCamps);


router.route('/:id')
    .get(getBootCamp)
    .put(updateBootCamp)
    .delete(deleteBootCamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootCampsInRedius);




module.exports = router;