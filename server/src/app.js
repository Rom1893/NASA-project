const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const api = require("./routes/api");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
/**
 * *morgan("combined")
 * is used to log the HTTP requests in the "combined" format, which includes the HTTP method, status code, response time, and other details. The output of these logs can be used for debugging, monitoring, and performance analysis.
 */

app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

/**
 * *API Version 1
 * added v1 to the routes located in api.js
 */

app.use("/v1", api);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
