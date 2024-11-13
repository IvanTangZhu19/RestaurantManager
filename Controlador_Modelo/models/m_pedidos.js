const {oracledb} = require('../config/database');

async function getOrders(){
    let connection;
    try {
        connection = await oracledb.getConnection();
        const query = 'SELECT * FROM PEDIDOS p '+
	        'JOIN CLIENTES c ON p.clienteID = c.id ' +
	        'JOIN PEDIDOS_PRODUCTOS pp ON p.id = pp.PEDIDOID '+
	        'JOIN PRODUCTOS pro ON pp.PRODUCTOID = pro.id';
        const result = await connection.execute(query);
        const datosOrganizados=organizarPedidos(result.rows);
        return datosOrganizados;
    } catch (err) {
        console.error("Error al obtener pedidos: ", err);
    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function getOrdersByDate(dia, mes, año){
    let connection;

    const fecha = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    try {
        connection = await oracledb.getConnection();
        const query = `SELECT * FROM PEDIDOS p 
	        JOIN CLIENTES c ON p.clienteID = c.id 
	        JOIN PEDIDOS_PRODUCTOS pp ON p.id = pp.PEDIDOID 
	        JOIN PRODUCTOS pro ON pp.PRODUCTOID = pro.id 
            WHERE TRUNC(p.fecha) = TO_DATE(:fecha, 'YYYY-MM-DD')`;
        const result = await connection.execute(query, {fecha});
        const datosOrganizados=organizarPedidos(result.rows);
        return datosOrganizados;
    } catch (err) {
        console.error("Error al obtener pedidos: ", err);
    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

function organizarPedidos(datos) {
    const pedidos = [];
  
    datos.forEach((fila) => {
      // Encontrar si el pedido ya existe por su ID (fila[0] es el ID del pedido)
      let pedido = pedidos.find(p => p.id === fila[0]);
      
      // Si no existe, crear un nuevo pedido
      if (!pedido) {
        pedido = {
          fecha: fila[1],
          id: fila[0], // ID del pedido (fila[0])
          cliente: {
            id: fila[3], // ClienteID (fila[1])
            nombre: fila[4], // Nombre del cliente (fila[2])
          },
          productos: []
        };
        pedidos.push(pedido);
      }
  
      // Agregar el producto al pedido
      pedido.productos.push({
        id: fila[12], // ProductoID (fila[3])
        nombre: fila[13], // Nombre del producto (fila[4])
        cantidad: fila[11], // Cantidad (fila[5])
        precio: fila[14] // Precio (fila[6])
      });
    });
  
    return pedidos;
  }
async function insertPedido(fecha, clienteID, productos){
    let connection;
    var pedidoID;
    var resultPedidos;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Pedidos (id, fecha, clienteID) 
                VALUES (pedidos_seq.NEXTVAL, TO_DATE(:fecha, 'YYYY-MM-DD HH24:MI:SS'), :clienteID)
                RETURNING id INTO :pedidoID`,
            {
                fecha, 
                clienteID, 
                pedidoID: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            {autoCommit: true}
        );
        pedidoID = result.outBinds.pedidoID[0];
        if(result.rowsAffected == 1) {
            resultPedidos = await insertProductosPedido(pedidoID, productos);
            if (resultPedidos)
                return {success: true};
            else 
                return {success: false};
        }
        else return {success: false};
    } catch (err) {
        console.error("Error al insertar pedido: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function insertProductosPedido(pedidoID, productos){
    let connection;
    try {
        connection = await oracledb.getConnection();
        for(const producto of productos){
            await connection.execute(
                `INSERT INTO Pedidos_productos (id, pedidoID, productoID, cantidad) 
                    VALUES (pedidos_productos_seq.NEXTVAL, :pedidoID, :productoID, :cantidad)`,
                {
                    pedidoID: pedidoID, 
                    productoID: producto.productoID, 
                    cantidad: producto.cantidad 
                },
                {autoCommit: true}
            );
        }
        return {success: true};
    } catch (err) {
        console.error("Error al insertar pedido: ", err);

    } finally {
        if(connection){
            try { await connection.close();}
            catch (err) { console.log("Error al cerrar conexión: ", err)}
        }
    }
}

async function deletePedido(id) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        // Primero eliminar los productos asociados
        await connection.execute(
            `DELETE FROM Pedidos_productos WHERE pedidoID = :id`,
            { id },
            { autoCommit: true }
        );
        
        // Luego eliminar el pedido
        const result = await connection.execute(
            `DELETE FROM Pedidos WHERE id = :id`,
            { id },
            { autoCommit: true }
        );
        
        if(result.rowsAffected == 1) return {success: true};
        else return {success: false, message: "No se encontró el pedido"};
        
    } catch (err) {
        console.error("Error al eliminar pedido: ", err);
        return {success: false, message: err.message};
    } finally {
        if(connection){
            try { await connection.close(); }
            catch (err) { console.log("Error al cerrar conexión: ", err) }
        }
    }
}

async function updatePedido(id, fecha, clienteID, productos) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        
        // Actualizar pedido principal
        const resultPedido = await connection.execute(
            `UPDATE Pedidos SET fecha = TO_DATE(:fecha, 'YYYY-MM-DD HH24:MI:SS'), 
             clienteID = :clienteID WHERE id = :id`,
            { id, fecha, clienteID },
            { autoCommit: true }
        );

        if(resultPedido.rowsAffected !== 1) {
            return {success: false, message: "No se encontró el pedido"};
        }

        // Eliminar productos antiguos
        await connection.execute(
            `DELETE FROM Pedidos_productos WHERE pedidoID = :id`,
            { id },
            { autoCommit: true }
        );

        // Insertar nuevos productos
        for(const producto of productos) {
            await connection.execute(
                `INSERT INTO Pedidos_productos (id, pedidoID, productoID, cantidad) 
                 VALUES (pedidos_productos_seq.NEXTVAL, :pedidoID, :productoID, :cantidad)`,
                {
                    pedidoID: id,
                    productoID: producto.productoID,
                    cantidad: producto.cantidad
                },
                { autoCommit: true }
            );
        }

        return {success: true};
    } catch (err) {
        console.error("Error al actualizar pedido: ", err);
        return {success: false, message: err.message};
    } finally {
        if(connection){
            try { await connection.close(); }
            catch (err) { console.log("Error al cerrar conexión: ", err) }
        }
    }
}


module.exports = {
    getOrders,
    insertPedido,
    deletePedido,
    updatePedido,
    getOrdersByDate
};