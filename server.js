require('dotenv').config();

const http = require('http');
const app = require('./app');

const { dbConnection } = require('./database/config');

// Base de datos
dbConnection();

//-Rutas

// Auth
app.use('/api/auth', require('./routes/auth.routes'));

app.listen( process.env.PORT || 3000 , () => console.log(`Port ${process.env.PORT}`) );
