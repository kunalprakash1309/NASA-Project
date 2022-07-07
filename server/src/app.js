const path = require('path');
const express = require('express');
const morgan = require('morgan');
const planetsRouter = require('./routes/planets/planets.router');

const app = express();

// handling cors or we can use cors package
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
})

app.use(morgan('combined'));


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

app.use(planetsRouter);

module.exports = app;