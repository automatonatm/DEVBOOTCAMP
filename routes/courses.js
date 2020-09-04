const express  = require('express');
const  router  = express.Router({mergeParams: true});

const {
    getCourses,
    getCourse,
    createCourse
} = require('../controllers/courses');


router.route('/')
    .get(getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourse);




module.exports = router;