const express = require('express');
const pedidoController = require('../controllers/c_pedidos')
const router = express.Router();

router.get('/', pedidoController.getAllOrders);

router.post('/fecha', pedidoController.getOrdersByDate);

router.post('/pedido', pedidoController.insertOrder);

router.post('/pedidos/fecha', pedidoController.getOrdersByDate);

router.get('/cliente/:clienteID', pedidoController.getOrdersByClient);

router.put('/actualizar', pedidoController.updateOrder);

router.get('/sales-data', pedidoController.getSalesData);

router.post('/sales-data/date', pedidoController.getSalesDataByDate);

router.delete('/eliminarPedido/:id', pedidoController.deleteOrder);

module.exports = router;    