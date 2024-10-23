const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const userRoutes = require('./routes/r_usuarios');
const productsRoutes = require('./routes/r_productos');
require('dotenv').config();

const server = express();
server.use(express.json());

database.initialize();

server.use('/usuarios', userRoutes);
server.use('/productos', productsRoutes);

const port = 4001;
server.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});

process.on('SIGINT', () => {
  database.close().then( () => {
    console.log('Aplicación cerrada');
    process.exit(0);
  })
})

module.exports = server;