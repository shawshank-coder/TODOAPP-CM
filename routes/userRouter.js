const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const router = new express.Router()

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.delete('/deleteme', authController.protect, userController.deleteme);

module.exports = router