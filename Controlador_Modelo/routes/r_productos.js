const express = require('express');
const productsController = require('../controllers/c_productos')
const router = express.Router();

router.get('/', productsController.getAllProducts);

router.post('/producto', productsController.insertProduct);


module.exports = router;