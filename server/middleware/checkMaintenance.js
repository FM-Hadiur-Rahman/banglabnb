// middleware/checkMaintenance.js
const GlobalConfig = require("../models/GlobalConfig");

module.exports = async function checkMaintenance(req, res, next) {
  const config = await GlobalConfig.findOne();
  const isAdmin = req.user?.role === "admin"; // you must have protect middleware before this

  if (config?.maintenanceMode && !isAdmin) {
    return res.status(503).json({ message: "🚧 Site is under maintenance" });
  }

  next();
};
