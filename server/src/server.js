const http = require("http");
const app = require("./app"); // Express app from another file
const PORT = process.env.PORT || 8000;
const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);

const startServer = async () => {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
