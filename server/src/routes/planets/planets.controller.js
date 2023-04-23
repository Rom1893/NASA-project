const { getAllplanets } = require("../../models/planets.model");

const httpGetAllPlanets = async (req, res) => {
  return res.status(200).json(await getAllplanets());
};

module.exports = {
  httpGetAllPlanets,
};
