const { getAllplanets } = require("../../models/planets.model");

const httpGetAllPlanets = (req, res) => {
  return res.status(200).json(getAllplanets());
};

module.exports = {
  httpGetAllPlanets,
};
