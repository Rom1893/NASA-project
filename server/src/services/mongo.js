const mongoose = require("mongoose");
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
 * no need to add newUrlParser and other common options
 */

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL);
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
