// mongodb
require("./config/db");
const userRoutes = require('./routes/signuproutes');

const express = require("express");
const bodyParser = require('express').json;
const cors = require("cors");

// create server app
const app = express();

const corsOptions = {
  origin: ['https://sureshspd.github.io'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.use(bodyParser());

// Handling preflight requests
app.options('*', cors(corsOptions));

// Use userRoutes
app.use('/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
