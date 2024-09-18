const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer();
require('dotenv').config();
const format = require('date-fns').format;

const cloudinary = require('../cloudinary');

exports.newFilePost = async (req, res, next) => {
    const file = req.file;
    const folderId = req.params.folderid;

    try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            public_id: file.originalname,
        }).catch((error) => {
            console.log(error);
        })
        const newFile = await prisma.file.create({
            data: {
                name: file.originalname,
                size: file.size,
                url: uploadResult.secure_url,
                folderId: folderId,
            }
        });
        res.redirect(`/folders/${folderId}`)
    } catch (err) {
        return next(err);
    }
}

exports.deleteFilePost = async (req, res, next) => {
    try {
        const fileId = req.params.fileid
        const fileToDelete = await prisma.file.delete({
            where: {
                id: fileId
            }
        });
        // if (req.user.id !== fileToDelete.userId) {
        //     const message = 'You are not authorized to view that folder.'
        //     const folders = await prisma.user.findUnique({
        //         where: {
        //             id: req.user.id
        //         },
        //         include: {
        //             folders: true,
        //         }
        //     })
        //     res.render('dashboard', { 
        //         title: 'Dashboard', 
        //         user: req.user,
        //         folders: folders.folders,
        //         format: format,
        //         message: message
        //     })
        //     return
        // }
        res.redirect('back')
    } catch (err) {
        console.error(err);
    }
}