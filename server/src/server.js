const http = require("http");
const mongoose = require("mongoose");
const app = require("./app"); // Express app from another file
const PORT = process.env.PORT || 8000;
const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);
const MONGO_URL =
  //Add .env File
  "mongodb+srv://@nasacluster.hlvqmua.mongodb.net/nasa?retryWrites=true&w=majority";

const startServer = async () => {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

startServer();
