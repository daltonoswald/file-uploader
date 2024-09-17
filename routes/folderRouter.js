const express = require('express');
const multer = require('multer');
const cloudinary = require('../cloudinary');
const folderController = require('../controllers/folderController');
const fileController = require('../controllers/fileController');
const isSignedIn = require('../middleware').isSignedIn

// const upload = multer({ dest: './public/data/uploads'});

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage});

const router = express.Router();

router.get('/:folderid', isSignedIn, folderController.folderPageGet);
router.post('/create-folder', isSignedIn, folderController.createFolder);
router.get('/delete-folder/:folderid', isSignedIn, folderController.deleteFolderGet);
router.post('/delete-folder/:folderid', isSignedIn, folderController.deleteFolderPost);

router.get('/edit-folder/:folderid', isSignedIn, folderController.editFolderGet);
router.post('/edit-folder/:folderid', isSignedIn, folderController.editFolderPost);

router.post('/upload/:folderid/new-file', isSignedIn, upload.single('uploaded_file'), fileController.newFilePost);
router.post('/delete-file/:fileid', isSignedIn, fileController.deleteFilePost);



module.exports = router;