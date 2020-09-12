const express  = require('express');
const  router  = express.Router();
const {protect, authorize} = require('../middleware/auth');
const advanceResults = require('../middleware/advanceResults');
const User  = require('../models/User');
const  {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}  = require('../controllers/users');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get( advanceResults(User, ''), getUsers)
    .post( createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;

