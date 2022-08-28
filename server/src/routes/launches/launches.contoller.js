const {
  existsLaunchWithId, 
  getAllLaunches, 
  scheduleNewLaunch,
  abortLaunchById, 
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
};

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: 'Missing required launch property',
    })
  }

  launch.launchDate = new Date(launch.launchDate);

  // const date = new Date("January 12, 2030") => date.valueOf() = 1893474000000 => isNan(date.valueOf()) = false
  // const date = new Date("Hello") => isNaN(date.valueOf()) = true
  if(isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = await existsLaunchWithId(launchId)
  // if flight exist or not
  if(!existsLaunch){
    return res.status(404).json({
      error: 'Launch not found',
    })
  }

  // if launch does exist
  const aborted = await abortLaunchById(launchId)

  if(!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted'
    });
  }

  return res.status(200).json({
    ok: true,
  })
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbbortLaunch
}