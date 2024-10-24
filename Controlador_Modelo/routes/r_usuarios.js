const express = require('express');
const userController = require('../controllers/c_usuarios')
const router = express.Router();

router.get('/usuarios', userController.getAllUsers);

router.post('/usuario', userController.insertUser);

router.post('/login', userController.login);

module.exports = router;