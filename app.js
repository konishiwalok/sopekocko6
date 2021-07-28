
const express = require('express');
// Crear el servidor de express
const app = express();

// Lectura y parseo del body
app.use( express.json() );

module.exports = app;

