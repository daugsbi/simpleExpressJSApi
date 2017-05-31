/**
 * Backend for an imaginary insurance app
 */
const express = require('express');
var bodyParser = require('body-parser');
const requestLogger = require('morgan');
const dbConfig = require('./config/database');
const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// connect to test database, see config/database
let mongoose   = require('mongoose');
mongoose.connect(dbConfig.url);

// Log all requests
app.use(requestLogger('combined'));

const userResource = require('./controller/user');
const contractResource = require('./controller/contract');

app.use('/user', userResource);
app.use('/contract', contractResource);

// finally start server
app.listen(3000, function () {
  console.log('Imaginary insurance API is listening on port 3000!');
});