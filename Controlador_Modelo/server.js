const express = require('express');
const cors = require('cors');

const server = express();

const port = 4001;
server.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});

module.exports = server;