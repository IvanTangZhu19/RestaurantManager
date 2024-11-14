const pedidoModel = require('../models/m_pedidos');

async function getAllOrders(req, res) {
    try{
        const pedidos = await pedidoModel.getOrders();
        res.status(200).json(pedidos);
    }catch (err){
        res.status(500).json({mensaje: "Error al obtener pedidos "+ err});
    }
}

async function insertOrder(req, res) {
    try {
        const { fecha, clienteID, productos } = req.body;
        if (!fecha || !clienteID || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: "Faltan datos o la estructura de productos es incorrecta" });
        }

        // Verifica que cada producto tenga la estructura { productoID, cantidad }
        const validProductos = productos.every(p => p.productoID && p.cantidad && p.cantidad > 0);
        if (!validProductos) {
            return res.status(400).json({ error: "La estructura de los productos es incorrecta o faltan datos" });
        }

        const order = await pedidoModel.insertPedido(fecha, clienteID, productos);
        if (order.success) {
            res.status(201).json({ message: "Pedido creado" });
        } else {
            res.status(400).json({ message: "Pedido no creado: " + order.message });
        }
    } catch (err) {
        res.status(500).json({ error: "Error al crear pedido: " + err.message });
    }
}


async function deleteOrder(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({error: "Falta el ID del pedido"});
        const result = await pedidoModel.deletePedido(id);
        if (result.success) {
            res.status(200).json({message: "Pedido eliminado exitosamente"});
        } else {
            res.status(400).json({message: result.message});
        }
    } catch (err) {
        res.status(500).json({error: "Error al eliminar el pedido: " + err.message});
    }
}

async function updateOrder(req, res) {
    try {
        const { id, fecha, clienteID, productos } = req.body;
        if (!id || !fecha || !clienteID || !productos) {
            return res.status(400).json({error: "Faltan datos requeridos"});
        }
        const result = await pedidoModel.updatePedido(id, fecha, clienteID, productos);
        if (result.success) {
            res.status(200).json({message: "Pedido actualizado exitosamente"});
        } else {
            res.status(400).json({message: result.message});
        }
    } catch (err) {
        res.status(500).json({error: "Error al actualizar el pedido: " + err.message});
    }
}

async function getOrdersByDate(req, res) {
    try {
        const { dia, mes, año } = req.body;
        if (!dia || !mes || !año) return res.status(400).json({ error: "Faltan datos" });
        const pedidos = await pedidoModel.getOrdersByDate(dia, mes, año);
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener pedidos por fecha: " + err.message });
    }
}

async function getOrdersByClient(req, res) {
    try {
        const { clienteID } = req.params;
        console.log(clienteID);
        if (!clienteID) return res.status(400).json({ error: "Falta el ID del cliente" });
        const pedidos = await pedidoModel.getOrdersByClient(clienteID);
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener pedidos por cliente: " + err.message });
    }
}
async function getSalesData(req, res) {
    try {
      const salesData = await pedidoModel.getSalesData();
      res.status(200).json(salesData);
    } catch (err) {
      res.status(500).json({ mensaje: "Error al obtener datos de ventas: " + err.message });
    }
  }
  
  router.get('/sales-data', getSalesData);

module.exports = {
    getAllOrders,
    getOrdersByDate,
    updateOrder,
    deleteOrder,
    insertOrder,
    getSalesData,
    getOrdersByClient
};