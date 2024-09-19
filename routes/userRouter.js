const express = require('express');
const userController = require('../controllers/userController');
const alreadySignedIn = require('../middleware').alreadySignedIn;

const router = express.Router();

router.get('/log-in', alreadySignedIn, userController.userLogInGet);
router.post('/log-in', alreadySignedIn, userController.userLogInPost);
router.get('/logout', userController.userLogout);

router.get('/sign-up', alreadySignedIn, userController.userSignUpGet);
router.post('/sign-up', alreadySignedIn, userController.userSignUpPost);

module.exports = router;