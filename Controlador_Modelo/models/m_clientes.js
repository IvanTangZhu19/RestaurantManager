const {oracledb} = require('../config/database');

async function getCliente(nombre){
    let connection;
    try {
        // connection = await oracledb.getConnection();
        // const result = await connection.execute('SELECT * FROM Pedidos');
        // return result.rows;
    } catch (err) {
        console.error("Error al obtener cliente: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function insertCliente(nombre, precio, costo){
    let connection;
    try {
        connection = await oracledb.getConnection();
        // const result = await connection.execute(
        //     `INSERT INTO Productos (id, nombre, precio, costo) VALUES (productos_seq.NEXTVAL, :nombre, :precio, :costo)`,
        //     {nombre, precio, costo},
        //     {autoCommit: true}
        // );
        // if(result.rowsAffected == 1) return {success: true};
        //else return {success: false};
    } catch (err) {
        console.error("Error al insertar cliente: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

module.exports = {
    getCliente,
    insertCliente,
};