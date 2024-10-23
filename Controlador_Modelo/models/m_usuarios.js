const {oracledb} = require('../config/database');
const bcrypt = require('bcrypt');

async function getUsers(){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Usuarios');
        return result.rows;
    } catch (err) {
        console.error("Error al obtener usuarios: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function getUser(nombre){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Usuarios WHERE nombre = :nombre', {nombre});
        return result.rows;
    } catch (err) {
        console.error("Error al obtener usuario: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function insertUser(nombre, contraseña, rol){
    let connection;
    try {
        const mensajeError = "Rol no existente o nombre de usuario ya existente";
        connection = await oracledb.getConnection();
        const rolIDConsult = await connection.execute('SELECT id FROM Roles WHERE nombre = :rol', {rol});
        var rolID;
        const hashPassword = await bcrypt.hash(contraseña, 5);
        const usuarioExistente = await getUser(nombre);
        if(rolIDConsult.rows.length > 0 && usuarioExistente.length == 0){
            rolID = rolIDConsult.rows[0][0];
            const result = await connection.execute(
                `INSERT INTO Usuarios (id, nombre, contraseña, rolID) VALUES (usuarios_seq.NEXTVAL, :nombre, :contraseña, :rolID)`,
                {nombre, contraseña: hashPassword, rolID},
                {autoCommit: true}
            );
            return {success: true};
        } else {
            console.log(mensajeError);
            return {succes: false, mensaje: mensajeError}
        }
    } catch (err) {
        console.error("Error al insertar usuarios: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}


module.exports = {
    getUsers,
    insertUser
};