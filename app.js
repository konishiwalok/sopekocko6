require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
// nettoie les données fournis par l'utilisateur pour empecher les injection ( nettoie les $ et les .)
const mongoSanitize = require('express-mongo-sanitize');
// Create the express server
const app = express();
const rateLimit = require("express-rate-limit");
const { dbConnection } = require('./database/config');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use( express.json() );

// database
dbConnection();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());
app.use(mongoSanitize());
//-Routes-------

// Auth
app.use('/api/auth', require('./routes/auth.routes'));
// Sauce
app.use('/api/sauces', require('./routes/sauce.routes'));


// Reading and parsing the body

module.exports = app;