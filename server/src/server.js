const http = require('http');
const mongoose = require('mongoose');

require('dotenv').config()

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');
const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL;

// we pass request listner to createServer(). i.e app is a request listner
const server = http.createServer(app);

// open event only fires once when connection succeed. that is why once is used
mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

// error event can get fired anytime during the whole process. that is why on is used
mongoose.connection.on('error', (err) => {
  console.log(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  await loadLaunchesData();
  
  server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});

};

startServer();





// we are including http because later we need 'http' module and it also help to seperate project to individual need.
// or
// when we use app.listen(). Under the hood express runs createServer() and server.listen()

