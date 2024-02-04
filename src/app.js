// mongodb
require("./config/db");
const userRoutes = require('./routes/signuproutes');

const express = require("express");
const bodyParser = require('express').json;
const cors = require("cors");

// create server app
const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'], // Add allowed HTTP methods as needed
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers explicitly
  // credentials: true, // Allow credentials (e.g., cookies)
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
