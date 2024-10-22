const express = require('express');
const userController = require('../controllers/c_usuarios')
const router = express.Router();

router.get('/usuarios', userController.getAllUsers);

router.post('/usuarios', userController.insertUser);

module.exports = router;