const userModel = require('../models/m_usuarios');
const bcrypt = require('bcrypt');

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

async function login(req, res){
    try{
        const {nombre, contraseña} = req.body;
        const user = await userModel.getUser(nombre);
        var contraseñaValida;
        //console.log(user.length);
        if(user.length >= 1){
            contraseñaValida = await bcrypt.compare(contraseña, user[0][2]);
            if(contraseñaValida) res.status(200).json({status: true});
            else res.status(500).json({mensaje: "Contraseña incorrecta"});
        } else {
            res.status(500).json({mensaje: "Nombre de usuario no existente"});
        }
    }catch (err){
        res.status(500).json({error: "Error login: "+err});
    }
}

module.exports = {
    getAllUsers,
    insertUser,
    login
};