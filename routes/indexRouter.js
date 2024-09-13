const express = require('express');
const indexController = require('../controllers/indexController');
const isSignedIn = require('../middleware').isSignedIn

const router = express.Router();

router.get('/', indexController.index);

router.get('/dashboard', isSignedIn, indexController.dashboardGet);

module.exports = router;