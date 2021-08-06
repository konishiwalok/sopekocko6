
const express = require('express');
const path = require('path');
// Crear el servidor de express
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use( express.json() );

app.use('/images', express.static(path.join(__dirname, 'images')));

//-Rutas-------

// Auth
app.use('/api/auth', require('./routes/auth.routes'));
// Souce
app.use('/api/sauces', require('./routes/sauce.routes'));

//-End-Rutas-------

// Lectura y parseo del body

module.exports = app;
