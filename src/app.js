// mongodb
require("./config/db");
const userRoutes = require('./routes/signuproutes');

const express = require("express");
const bodyParser = require('express').json;
const cors = require("cors");

// create server app
const app = express();

app.use(cors());
app.use(bodyParser());

// Use userRoutes
app.use('/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
