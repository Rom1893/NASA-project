const http = require("http");
const app = require("./app"); // Express app from another file
const { mongoConnect } = require("./services/mongo");
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

/**
 * *Connect Mongoose Function
 * mongoConnect function is imported from services, mongo.js
 * this way server,js looks cleaner and only takes thje PORT variable from the .env file
 */

const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
