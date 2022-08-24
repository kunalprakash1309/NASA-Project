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
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: "Kepler-442 b",
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
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

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  })
  
  if (!planet) {
    throw new Error('No matching planet found');
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function scheduleNewLaunch(launch) {
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
  abortLaunchById
};