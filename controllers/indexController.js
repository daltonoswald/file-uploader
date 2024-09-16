const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const format = require('date-fns').format;

exports.index = asyncHandler(async (req, res) => {
    res.render('index', { 
        title: 'Index Page', 
        user: req.user,
    })
})

exports.dashboardGet = asyncHandler(async (req, res) => {
    const message = req.session.messages || null;
    const folders = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        // include: {
        //     folders: true,
        // },
        include: {
            folders: {
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    _count: {
                        select: { files: true }
                    }
                }
            }
        }
    })
    console.log(folders.folders[0]);
    res.render('dashboard', { 
        title: 'Dashboard', 
        user: req.user,
        folders: folders.folders,
        format: format,
        message: message
    })
})