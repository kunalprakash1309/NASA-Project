const axios = require('axios');

const launchesDatabase = require('./lauches.mongo');
const planets = require('./planets.mongo');

// Initially this but we choose map object for more funtion
// const launches = []
// we can map any value to any other value
// preserver the we inset it
const launches = new Map();

// local state for flight number
const DEFAULT_FLIGHT_NUMBER = 100;

// data model required by frontend
const launch = {
  flightNumber: 100, //flight_number
  mission: 'Kepler Exploration X', //name
  rocket: 'Explorer IS1', // rocket.name
  launchDate: new Date('December 27, 2030'), //date_local
  target: "Kepler-442 b", //not applicable
  customers: ['ZTM', 'NASA'], //payload.customers
  upcoming: true, //upcoming
  success: true, //success
};

// lauches = {
//   100 => {
//     flightNumber: 100,
//     mission: 'kepler',
//     ...
//     ...
//   }
// }

saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLauches() {
  console.log('Downloading launch data... ');

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,  // for getting all response. Initially response consist for pages and limit.
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });


  if(firstLaunch) {
    console.log('Launch data already loaded');
  } else {
    await populateLauches();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  })
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne({}).sort('-flightNumber');

  if(!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, {"_id": 0, "__v": 0})
}

async function saveLaunch(launch) {

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  })
  
  if (!planet) {
    throw new Error('No matching planet found');
  }
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero To Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(launch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++; 
//   launches.set(
//     latestFlightNumber,
//     // we are setting the value for the user. This value need to set by server
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ['Zero to Mastery', 'NASA'],
//       flightNumber: latestFlightNumber
//     })
//   );
// }

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });

  return aborted.modifiedCount === 1;
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  loadLaunchesData,
};