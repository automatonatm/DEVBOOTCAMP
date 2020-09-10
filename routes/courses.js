const express  = require('express');
const  router  = express.Router({mergeParams: true});
const {protect, authorize} = require('../middleware/auth')

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
    .post(protect, authorize('admin', 'publisher'), createCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('admin', 'publisher'), updateCourse)
    .delete(protect, authorize('admin', 'publisher'), deleteCourse);




module.exports = router;