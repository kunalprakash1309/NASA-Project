// depends on stream functionality of node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo')


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
    .on('data', async (data) => {  // event 
        if(isHabitablePlanet(data)) {
          await savePlanet(data)
        }
      })
    .on('error', (err) => {
      console.log(err);
      reject(err);
    })
    .on('end',async () => {
      const countPlanetsFound = (await getALlPlanets()).length;
      console.log(`${countPlanetsFound} planets have found.`)
      resolve();
    })
  });
}

async function getALlPlanets() {
  return await planets.find({}, {
    "_id": 0, "__v": 0,
  })
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    })
  } catch(err) {
    console.error(`Could not save a planet ${err}`)
  }
}


module.exports = {
  loadPlanetsData,
  getALlPlanets
};
