// routes/adminLogs.js
const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");

router.get("/", protect, authorize("admin"), async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

module.exports = router;
