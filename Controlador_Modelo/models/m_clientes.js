const {oracledb} = require('../config/database');

async function getClients(){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Clientes');
        return result.rows;
    } catch (err) {
        console.error("Error al obtener todos los clientes: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function getClient(nombre, direccion){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Clientes WHERE nombre = :nombre AND direccion = :direccion',
            {nombre, direccion}
        );
        return result.rows;
    } catch (err) {
        console.error("Error al obtener cliente: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function insertClient(nombre, direccion, telefono, descripcion){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Clientes (id, nombre, direccion, telefono, descripcion) VALUES (clientes_seq.NEXTVAL, :nombre, :direccion, :telefono, :descripcion)`,
            {nombre, direccion, telefono, descripcion},
            {autoCommit: true}
        );
        if(result.rowsAffected == 1) return {success: true};
        else return {success: false};
    } catch (err) {
        console.error("Error al insertar cliente: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function updateClient(id, nombre, direccion, telefono, descripcion){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE Clientes SET nombre = :nombre, direccion=:direccion, telefono = :telefono, descripcion = :descripcion
                WHERE id = :id`,
            {nombre, direccion, telefono, descripcion, id},
            {autoCommit: true}
        );
        if(result.rowsAffected == 1) return {success: true};
        else return {success: false};
    } catch (err) {
        console.error("Error al actualizar cliente: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

module.exports = {
    getClients,
    getClient,
    insertClient,
    updateClient
};