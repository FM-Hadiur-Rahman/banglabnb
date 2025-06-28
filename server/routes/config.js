// routes/config.js
const express = require("express");
const router = express.Router();
const GlobalConfig = require("../models/GlobalConfig");

// Public route to get config
router.get("/", async (req, res) => {
  const config = await GlobalConfig.findOne();
  res.json({ maintenanceMode: config?.maintenanceMode || false });
});

module.exports = router;
