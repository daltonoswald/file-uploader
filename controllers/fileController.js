const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer();
require('dotenv').config();
const format = require('date-fns').format;

exports.newFilePost = async (req, res, next) => {
    const file = req.file;
    const folderId = req.params.folderid;
    // console.log('File: ', file);
    // console.log('Folderid: ', folderId);

    try {
        const newFile = await prisma.file.create({
            data: {
                name: file.originalname,
                size: file.size,
                url: file.path,
                folderId: folderId,
            }
        });
        console.log(newFile)
        res.redirect(`/folders/${folderId}`)
    } catch (err) {
        return next(err);
    }
}