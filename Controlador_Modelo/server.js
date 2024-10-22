const express = require('express');
const cors = require('cors');
const database = require('./config/database');
require('dotenv').config();

const server = express();

database.initialize();

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