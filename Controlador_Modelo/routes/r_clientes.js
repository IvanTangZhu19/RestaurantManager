const express = require('express');
const clientsController = require('../controllers/c_clientes')
const router = express.Router();

router.get('/', clientsController.getAllClients);

router.post('/cliente', clientsController.insertClient);

router.put('/actualizarCliente', clientsController.updateClient);

module.exports = router;