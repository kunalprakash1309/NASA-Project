const http = require('http');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

// we pass request listner to createServer(). i.e app is a request listner
const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();
  
  server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});

};

startServer();





// we are including http because later we need 'http' module and it also help to seperate project to individual need.
// or
// when we use app.listen(). Under the hood express runs createServer() and server.listen()

