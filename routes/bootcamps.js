

const express  = require('express')
const  router  = express.Router()

const  {
    getBootCamps,
    getBootCamp,
    createBootCamp,
    updateBootCamp,
    deleteBootCamp
}  = require('../controllers/bootcamps')


router.route('/')
    .post(createBootCamp)
    .get(getBootCamps);


router.route('/:id')
    .get(getBootCamp)
    .put(updateBootCamp)
    .delete(deleteBootCamp)



module.exports = router;