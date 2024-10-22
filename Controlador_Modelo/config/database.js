const oracledb = require('oracledb');
require('dotenv').config();

async function initialize(){
    try{
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTIONSTRING
        });
        console.log("Base de datos conectada");
    }catch (err) {
        console.error("Error al conectar a la base de datos: ", err);
    }
}

async function close(){
    try{
        await oracledb.getPool().close();
        console.log("Conexión a la base de datos cerrada");
    } catch (err){
        console.error("Error al cerrar conexión: ", err);
    }
}

module.exports = {
    initialize,
    close,
    oracledb
}