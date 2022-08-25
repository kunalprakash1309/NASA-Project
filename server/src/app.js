const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const api = require('./api');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}));

// handling cors or we can use cors package
// app.use((req, res, next) => {
//   res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE')
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// })

app.use(morgan('combined'));


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1',api);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;