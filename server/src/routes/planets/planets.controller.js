const { getALlPlanets } = require('../../models/planets.model');

function httpGetALlPlanets(req, res) {
  return res.status(200).json(getALlPlanets())
}

module.exports = {
  httpGetALlPlanets
}