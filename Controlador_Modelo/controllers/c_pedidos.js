const pedidoModel = require('../models/m_pedidos');

async function getAllOrders(req, res) {
    try{
        const pedidos = await pedidoModel.getOrders();
        res.status(200).json(pedidos);
    }catch (err){
        res.status(500).json({mensaje: "Error al obtener pedidos "+ err});
    }
}

module.exports = {
    getAllOrders,
};