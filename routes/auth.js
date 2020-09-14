const express  = require('express');
const  router  = express.Router();
const {protect} = require('../middleware/auth');

const {register, login, logOut, setResetPasswordToken, resetPassword, updateDetails, updatePassword,  getMe} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', setResetPasswordToken);
router.post('/resetpassword/:resettoken',  resetPassword);
router.put('/updatedetails',  protect, updateDetails);
router.put('/updatepassword',  protect, updatePassword);
router.get('/me', protect, getMe);
router.get('/logout', protect, logOut);



module.exports = router;
