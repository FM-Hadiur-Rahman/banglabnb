// models/GlobalConfig.js
const mongoose = require("mongoose");

const globalConfigSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("GlobalConfig", globalConfigSchema);
