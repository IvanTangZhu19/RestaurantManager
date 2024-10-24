const {oracledb} = require('../config/database');

async function getProducts(){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Productos');
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

async function getProduct(nombre){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Productos WHERE nombre = :nombre',
            {nombre}
        );
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

async function insertProduct(nombre, precio, costo){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Productos (id, nombre, precio, costo) VALUES (productos_seq.NEXTVAL, :nombre, :precio, :costo)`,
            {nombre, precio, costo},
            {autoCommit: true}
        );
        if(result.rowsAffected == 1) return {success: true};
        else return {success: false};
    } catch (err) {
        console.error("Error al insertar producto: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function deleteProduct(nombre){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Productos (id, nombre, precio, costo) VALUES (productos_seq.NEXTVAL, :nombre, :precio, :costo)`,
            {nombre, precio, costo},
            {autoCommit: true}
        );
        if(result.rowsAffected == 1) return {success: true};
        else return {success: false};
    } catch (err) {
        console.error("Error al insertar producto: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function updateProduct(nombre, precio, costo){
    let connection;
    try {
        connection = await oracledb.getConnection();
        // const result = await connection.execute(
        //     `INSERT INTO Productos (id, nombre, precio, costo) VALUES (productos_seq.NEXTVAL, :nombre, :precio, :costo)`,
        //     {nombre, precio, costo},
        //     {autoCommit: true}
        // );
        if(result.rowsAffected == 1) return {success: true};
        else return {success: false};
    } catch (err) {
        console.error("Error al actualizar producto: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

module.exports = {
    getProducts,
    getProduct,
    insertProduct,
    updateProduct,
    deleteProduct
};