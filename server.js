require('dotenv').config();

const http = require('http');
const app = require('./app');

const { dbConnection } = require('./database/config');

// Base de datos
dbConnection();

app.listen( process.env.PORT || 3000 , () => console.log(`Port ${process.env.PORT}`) );