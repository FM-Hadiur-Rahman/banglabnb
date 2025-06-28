// middleware/checkMaintenance.js
const GlobalConfig = require("../models/GlobalConfig");

const checkMaintenance = async (req, res, next) => {
  const config = await GlobalConfig.findOne();
  if (config?.maintenanceMode) {
    return res
      .status(503)
      .json({ message: "🚧 BanglaBnB is under maintenance" });
  }
  next();
};

module.exports = checkMaintenance;
