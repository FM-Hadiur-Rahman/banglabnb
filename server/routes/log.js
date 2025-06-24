// routes/logs.js
const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

router.post("/", async (req, res) => {
  try {
    const { message, stack, userId, context, timestamp } = req.body;
    await Log.create({ message, stack, userId, context, timestamp });
    res.status(201).json({ message: "Log saved" });
  } catch (err) {
    console.error("❌ Log save error:", err);
    res.status(500).json({ message: "Failed to save log" });
  }
});

module.exports = router;
