const express = require('express');
const productsController = require('../controllers/c_productos')
const router = express.Router();

router.get('/', productsController.getAllProducts);

router.post('/producto', productsController.insertProduct);

router.delete('/eliminarProducto', productsController.deleteProduct);

router.put('/actualizarProducto', productsController.updateProduct);

module.exports = router;