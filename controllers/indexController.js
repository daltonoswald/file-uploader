const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

exports.index = asyncHandler(async (req, res) => {
    res.render('index', { title: 'Index Page'})
})