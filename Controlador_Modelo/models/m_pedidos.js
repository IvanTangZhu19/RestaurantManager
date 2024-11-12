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

function organizarPedidos(datos) {
    const pedidos = [];
  
    datos.forEach((fila) => {
      // Encontrar si el pedido ya existe por su ID (fila[0] es el ID del pedido)
      let pedido = pedidos.find(p => p.id === fila[0]);
      
      // Si no existe, crear un nuevo pedido
      if (!pedido) {
        pedido = {
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

module.exports = {
    getOrders,
    insertPedido,
};