const userModel = require('../models/m_usuarios');

async function getAllUsers(req, res) {
    try{
        const users = await userModel.getUsers();
        res.status(200).json(users);
    }catch (err){
        res.status(500).json({error: "Error al obtener usuarios"});
    }
}

async function insertUser(req, res) {
    try{
        const {nombre, contraseña, rol} = req.body;
        if(!nombre || !contraseña || !rol) return res.status(400).json({error: "Faltan datos"});
        const user = await userModel.insertUser(nombre, contraseña, rol);
        if(user.success) {
            res.status(201).json({message: "Usuario creado"});
        } else {
            res.status(500).json({message: user.mensaje});
        }
    }catch (err){
        res.status(500).json({error: "Error al crear usuarios"});
    }
}

module.exports = {
    getAllUsers,
    insertUser
};