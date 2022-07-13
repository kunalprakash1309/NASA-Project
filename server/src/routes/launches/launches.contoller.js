const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  // convert MAP object to array. Because res.json() takes certain types. eg array, plain object
  // we need to convert it to json readable by converting to array(by [...lauches.value()] or below option)
  return res.status(200).json(getAllLaunches());
};

function httpAddNewLaunch(req, res) {
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

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
}