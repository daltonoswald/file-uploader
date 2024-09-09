const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/log-in', userController.userLogInGet);
router.post('/log-in', userController.userLogInPost);
router.get('/logout', userController.userLogout);

router.get('/sign-up', userController.userSignUpGet);
router.post('/sign-up', userController.userSignUpPost);

module.exports = router;