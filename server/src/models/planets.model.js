// depends on stream functionality of node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

// storing habitable planets
const habitablePlanets = [];


function isHabitablePlanet(planet) {

  // condition required for habitable planets
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
};


function loadPlanetsData() {
  // creating readstream 
  return new Promise((resolve, reject) => { 
    fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
    // pipe connect fs readstream and pass it to destination i.e parse stream
    .pipe(parse({  // parse is writable stream
      comment: '#',
      columns: true,
    }))
    .on('data', (data) => {  // event 
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
    .on('error', (err) => {
      console.log(err);
      reject(err);
    })
    .on('end',() => {
      console.log(`${habitablePlanets.length} planets have found.`)
      resolve();
    })
  });
}

function getALlPlanets() {
  return habitablePlanets
}


module.exports = {
  loadPlanetsData,
  getALlPlanets
};
