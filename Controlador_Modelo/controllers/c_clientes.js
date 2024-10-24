const clientModel = require('../models/m_clientes');

async function getAllClient(req, res) {
    try{
        const productos = await clientModel.getClients();
        res.status(200).json(productos);
    }catch (err){
        res.status(500).json({mensaje: "Error al obtener productos"});
    }
}

async function insertClient(req, res) {
    try{
        const {nombre, direccion, telefono} = req.body;
        if(!nombre || !direccion || !telefono) return res.status(400).json({error: "Faltan datos"});
        const user = await clientModel.insertClient(nombre, precio, costo);
        if(user.success) {
            res.status(201).json({message: "Cliente creado"});
        } else {
            res.status(500).json({message: "Cliente no creado"});
        }
    }catch (err){
        res.status(500).json({error: "Error al crear cliente"});
    }
}

module.exports = {
    getAllClient,
    insertClient
};