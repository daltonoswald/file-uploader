const express = require('express');
const folderController = require('../controllers/folderController');

const router = express.Router();

router.get('/:folderid', folderController.folderPageGet);
router.post('/create-folder', folderController.createFolder);
router.get('/delete-folder/:folderid', folderController.deleteFolderGet);



module.exports = router;