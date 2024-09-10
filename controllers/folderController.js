const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

exports.folderPageGet = async (req, res, next) => {
    const folderId = req.params.folderid;
    const folderDetails = await prisma.folder.findUnique({
        where: {
            id: folderId
        },
        include: {
            files: true,
        }
    })

    res.render('folder-page', {
        title: `Folder: ${folderDetails.name}`,
        folder: folderDetails,
        user: req.user,
    })
}

exports.createFolder = [
    body('name', 'Folder name must not be empty')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('/dashboard', {
                title: 'Dashboard',
                erros: errors.array()
            });
            return
        }

        const { name } = req.body;
        const userId = req.user.id;
        console.log('Line 32', name);
        console.log('Line 33', userId);
        try {
            await prisma.folder.create({
                data: {
                    name: name,
                    userId: userId
                }
            });
            res.redirect('/dashboard');
        } catch (err) {
            return next(err);
        }
    }
]

exports.deleteFolderGet = async (req, res, next) => {
    const folderId = req.params.folderid;
    console.log('Line 61 ', folderId);
    const folderToDelete = await prisma.folder.findUnique({
        where: {
            id: folderId
        }
    });
    res.render('delete-folder', {
        title: 'Delete Folder',
        user: req.user,
        folder: folderToDelete,
        userFolderId: req.params.id,
    })
}