const express  = require('express');
const  router  = express.Router({mergeParams: true});

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

const Courses  = require('../models/Course');
const advanceResults = require('../middleware/advanceResults');

router.route('/')
    .get(advanceResults(Courses, {
        path: 'bootcamp',
        select: 'slug name description'
    }), getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);




module.exports = router;