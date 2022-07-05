const express = require('express');
const {
  getALlPlanets
} = require('../planets/planets.controller');

const planetsRouter = express.Router();

planetsRouter.get('/planets', getALlPlanets);

module.exports = planetsRouter;