const express = require('express');
const planetsRouter = require('./routes/planets/planets.router');

const app = express();

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
})

app.use(express.json());
app.use(planetsRouter);

module.exports = app;