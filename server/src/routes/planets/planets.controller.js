const { planets } = require('../../models/planets.model');

function getALlPlanets(req, res) {
  return res.status(200).json(planets)
}

module.exports = {
  getALlPlanets
}