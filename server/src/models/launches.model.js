// Initially this but we choose map object for more funtion
// const launches = []
// we can map any value to any other value
// preserver the we inset it
const launches = new Map();

// local state for flight number
let latestFlightNumber = 100;

// data model required by frontend
const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
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
launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++; 
  launches.set(
    latestFlightNumber,
    // we are setting the value for the user. This value need to set by server
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: latestFlightNumber
    })
  );
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
};