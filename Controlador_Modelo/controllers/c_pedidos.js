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
    try{
        const {fecha, clienteID, productos} = req.body;
        if(!fecha || !clienteID || !productos) return res.status(400).json({error: "Faltan datos"});
        const order = await pedidoModel.insertPedido(fecha, clienteID, productos);
        if(order.success) {
            res.status(201).json({message: "Pedido creado"});
        } else {
            res.status(400).json({message: "Pedido no creado: " + product.message });
        }
    }catch (err){
        res.status(500).json({error: "Error al crear pedido"});
    }
}

module.exports = {
    getAllOrders,
    insertOrder
};