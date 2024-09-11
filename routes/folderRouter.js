const express = require('express');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads'});
const folderController = require('../controllers/folderController');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/:folderid', folderController.folderPageGet);
router.post('/create-folder', folderController.createFolder);
router.get('/delete-folder/:folderid', folderController.deleteFolderGet);
router.post('/delete-folder/:folderid', folderController.deleteFolderPost);

router.post('/upload/:folderid/new-file', upload.single('uploaded_file'), fileController.newFilePost);



module.exports = router;