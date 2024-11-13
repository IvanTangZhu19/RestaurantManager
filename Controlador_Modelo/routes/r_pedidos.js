const express = require('express');
const pedidoController = require('../controllers/c_pedidos')
const router = express.Router();

router.get('/', pedidoController.getAllOrders);

router.post('/fecha', pedidoController.getOrdersByDate);

router.post('/pedido', pedidoController.insertOrder);

router.post('/pedidos/fecha', c_pedidos.getOrdersByDate);

router.get('/pedidos/cliente/:clienteID', c_pedidos.getOrdersByClient);

module.exports = router;    