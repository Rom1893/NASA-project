const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;

/**
 * *Event listeners
 * When conecction is successful and for when it encounters an error
 */

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

/**
 * *Mongo Connect Function
 * this function is exported to server.js for connecting to mongo
 */

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

/**
 * *Mongo disconnect function
 * used in launches.test, allowing jest to exit and not stick around
 */

const mongoDisconnect = async () => await mongoose.disconnect;

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
