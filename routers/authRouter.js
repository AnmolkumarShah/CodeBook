const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

router.get('/login',authController.login);

router.get('/signup',authController.signup);

router.post('/login',authController.postLogin);

router.post('/signup',authController.postSignup);

router.post('/logout',authController.postLogout);

router.get('/reset',authController.getResetPassword);

router.post('/reset',authController.postResetPassword);

router.get('/reset/:token',authController.getNewPassword);

router.post('/new-password',authController.postNewPassword)

module.exports = router;