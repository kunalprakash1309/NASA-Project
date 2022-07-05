const http = require('http');

const app = require('./app');

const PORT = process.env.PORT || 8000;

// we pass request listner to createServer(). i.e app is a request listner
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}...`);
});

// we are including http because later we need 'http' module and it also help to seperate project to individual need.
// or
// when we use app.listen(). Under the hood express runs createServer() and server.listen()

