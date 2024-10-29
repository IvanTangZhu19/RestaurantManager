const clientModel = require('../models/m_clientes');

async function getAllClients(req, res) {
    try{
        const clientes = await clientModel.getClients();
        res.status(200).json(clientes);
    }catch (err){
        res.status(500).json({mensaje: "Error al obtener clientes"});
    }
}

async function insertClient(req, res) {
    try{
        const {nombre, direccion, telefono, descripcion} = req.body;
        if(!nombre || !direccion || !telefono || !descripcion) return res.status(400).json({error: "Faltan datos"});
        const user = await clientModel.insertClient(nombre, direccion, telefono, descripcion);
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
    getAllClients,
    insertClient
};