const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

exports.index = asyncHandler(async (req, res) => {
    res.render('index', { 
        title: 'Index Page', 
        user: req.user,
    })
})

exports.dashboardGet = asyncHandler(async (req, res) => {
    const folders = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        include: {
            folders: true,
        }
    })
    res.render('dashboard', { 
        title: 'Dashboard', 
        user: req.user,
        folders: folders.folders
    })
})