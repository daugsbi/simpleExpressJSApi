/**
 * Backend for an imaginary insurance app
 */
const express = require('express');
const logger = require('winston');
const dbConfig = require('./config/database');
var bodyParser = require('body-parser');
const requestLogger = require('morgan');
let customPassport = require('./authentication/customPassport');
const path = require('path');
const app = express();

// connect to test database, see config/database
let mongoose   = require('mongoose');
mongoose.connect(dbConfig.url);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Log all requests
app.use(requestLogger('combined'));

// Define endpoints without authentication
const publicUserEndPoint = require('./controller/user');
app.use('/user', publicUserEndPoint);

// Protect all other endpoints with bearer token
app.use(customPassport.initialize());
app.all('*', customPassport.authenticate('bearer'));

// Define protected endpoints
const contractEndPoint = require('./controller/contract');
app.use('/contract', contractEndPoint);

// finally start server
app.listen(3000, function () {
  logger.info('Imaginary insurance API is listening on port 3000!');
});