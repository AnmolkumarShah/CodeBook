const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

const isAuth = require('../middleware/isAuth');

router.post('/save-program',isAuth, userController.postSaveCode);

router.post('/delete-program',isAuth,userController.postDeleteProgram);

router.post('/toggle-public',isAuth,userController.togglePublic);

router.post('/toggle-stared',isAuth,userController.toggleStared);

router.get('/mybook',userController.getCodeBook);

module.exports = router;