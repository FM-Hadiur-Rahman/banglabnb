// models/Log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: { type: String, enum: ["info", "warn", "error"], default: "error" },
  message: String,
  stack: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);
