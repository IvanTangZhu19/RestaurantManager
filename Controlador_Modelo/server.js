const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const userRoutes = require('./routes/r_usuarios');
const productsRoutes = require('./routes/r_productos');
const clientsRoutes = require('./routes/r_clientes');
const ordersRoutes = require('./routes/r_pedidos');
require('dotenv').config();

const server = express();
server.use(express.json());

server.use(cors({
  origin: 'http://localhost:8080',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

database.initialize();

server.use('/usuarios', userRoutes);
server.use('/productos', productsRoutes);
server.use('/clientes', clientsRoutes);
server.use('/pedidos', ordersRoutes);

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