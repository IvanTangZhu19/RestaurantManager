const { prefetchRows } = require('oracledb');
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

async function getProductByName(nombre){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Productos WHERE nombre = :nombre',
            {nombre}
        );
        return result.rows;
    } catch (err) {
        console.error("Error al obtene producto por nombre: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function getProductById(id){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Productos WHERE id = :id',
            {id: {
                val: id,
                type: oracledb.NUMBER
            }} 
        );
        return result.rows;
    } catch (err) {
        console.error("Error al obtener producto por id: ", err);
    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function getProductsOrdersById(id){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM Pedidos_productos WHERE productoID = :id',
            {id: {
                val: id,
                type: oracledb.NUMBER
            }} 
        );
        return result.rows;
    } catch (err) {
        console.error("Error al obtener producto por id: ", err);
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
        const productoExistente = await getProductByName(nombre);
        var result;
        console.log(productoExistente.length);
        if(productoExistente.length <= 0){
            result = await connection.execute(
                `INSERT INTO Productos (id, nombre, precio, costo) VALUES (productos_seq.NEXTVAL, :nombre, :precio, :costo)`,
                {nombre, precio, costo},
                {autoCommit: true}
            );
            if(result.rowsAffected == 1) return {success: true};
            else return {success: false, message: "No generó cambios"};
        } else return {success: false, message: "Nombre de Producto existente"};
        
    } catch (err) {
        console.error("Error al insertar producto: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function deleteProduct(id){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const productoExistente = await getProductById(id);
        var result;
        console.log(productoExistente);
        if(productoExistente.length > 0){
            result = await connection.execute(
                `DELETE FROM Productos WHERE id = :id`,
                { id },
                {autoCommit: true}
            );
            if(result.rowsAffected == 1) return {success: true};
            else return {success: false, message: "No se eliminó el producto"};
        } else return {success: false, message: "No existe el producto"};
    } catch (err) {
        console.error("Error al eliminar producto: ", err);
        return {success: false, message: "Error: "+err}
    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function updateProduct(id, nombre, precio, costo){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const productoExistente = await getProductById(id);
        var result;
        if(productoExistente.length > 0){
            result = await connection.execute(
                `UPDATE Productos SET nombre = :nombre, precio= :precio, costo = :costo WHERE id = :id`,
                { nombre, precio, costo, id },
                {autoCommit: true}
            );
            if(result.rowsAffected == 1) return {success: true};
            else return {success: false, message: "No se actualizó el producto"};
        } else return {success: false, message: "No existe el producto"};
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
    getProductById,
    getProductByName,
    insertProduct,
    updateProduct,
    deleteProduct,
    getProductsOrdersById
};