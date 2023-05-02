const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

let latestFlightNumber = 100;

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet was found");
  }

  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ROM"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

const existsLaunchWithId = (launchId) => {
  return launches.has(launchId);
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDatabase.sort("-flightNumber").findOne({});

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

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    sucess: true,
    upcoming: true,
    customers: ["NASA", "ROM"],
    flightNumber: newFlightNumber,
  });
};

// const addNewLaunch = (launch) => {
//   latestFlightNumber++;
//   launches.set(
//     launch.flightNumber,
//     Object.assign(launch, {
//       flightNumber: latestFlightNumber,
//       customers: ["NASA", "ROM"],
//       upcoming: true,
//       success: true,
//     })
//   );
// };

const abortLaunchById = (launchId) => {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
};

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
//MongoDB now
