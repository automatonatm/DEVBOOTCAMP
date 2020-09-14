const express  = require('express');
const  router  = express.Router({mergeParams: true});
const {protect, authorize} = require('../middleware/auth');



const {
  getReviews, createReview, getReview, updateReview, deleteReview
} = require('../controllers/reviews');

const Reviews  = require('../models/Reviews');
const advanceResults = require('../middleware/advanceResults');

router.route('/')
    .get(advanceResults(Reviews, {
        path: 'bootcamp',
        select: 'slug name description'
    }), getReviews)
   .post(protect, authorize('admin', 'user'), createReview);

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('admin', 'user'), updateReview)
    .delete(protect, authorize('admin', 'user'), deleteReview);



module.exports = router;