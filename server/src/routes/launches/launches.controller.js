const {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
} = require("../../models/launches.model");

/**
 * *For the GET METHOD of all launches
 */

const httpGetAllLaunches = async (req, res) => {
  return res.status(200).json(await getAllLaunches());
};

/**
 * *Add new Launch with validation
 */

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

/**
 * *Abort launch, validates if launch exists, then aborts.
 * +req.params.id = Converts req.params.id to number (with the + sign)
 */

const httpAbortLaunch = async (req, res) => {
  const launchId = +req.params.id;
  const existLaunch = await existsLaunchWithId(launchId);

  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
};

/**
 * *EXPORTS
 */

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
