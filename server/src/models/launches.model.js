const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
let latestFlightNumber = 100;

/**
 * *TEMPLATE LAUNCH
 */

const launch = {
  flightNumber: 100 /**This info is under flight_number in the spaceX API */,
  mission: "Kepler Exploration X" /** name in the spaceX API */,
  rocket: "Explorer IS1" /** rocket.name in the spaceX API */,
  launchDate: new Date("December 27, 2030") /** date_local in the spaceX API */,
  target: "Kepler-442 b" /** not applicable */,
  customers: ["NASA", "ROM"] /** payload.customers for each payload */,
  upcoming: true /**upcoming */,
  success: true /**success */,
};

/**
 * *SAVE LAUNCH FUNCTION
 * @param launch
 */

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet was found");
  }

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

saveLaunch(launch);

/**
 * *LoadLaunchesData from SPACE-X API
 * *Iterate over the SPACE-X API data
 */

const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

const loadLaunchData = async () => {
  console.log("Downloading Data");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  /**
   * I used the keyword *DOCS* because the SPACE-X API sends me an object with the key DOCS that corresponds to an array with all the data I'm interested in.
   * This iteration lets me gather the info I'm interested in, and create another object called launch with that same data but more compact.
   */

  const launchDocs = response.data.docs;
  for (let launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    /**
     * Since payloads is an array, what I want to do here is to create a single array with all the customers, for that I use the flatMap built in JS function, which takes the payloads array, looks for the customer variable in the object, then takes the payloads array and customers array variable I looked for and flattens them into a single array.
     */
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
  }
};

/**
 * *GET METHODS
 */

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

const existsLaunchWithId = async (launchId) => {
  return await findLaunch({
    flightNumber: launchId,
  });
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
};

const getAllLaunches = async () => {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
};

/**
 * *ADD NEW LAUNCH
 */

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    sucess: true,
    upcoming: true,
    customers: ["NASA", "ROM"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
};

/**
 * *ABORT LAUNCH
 */

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.ok === 1 && aborted.nModified === 1;
};

/**
 * *EXPORTS
 */

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
//MongoDB now
