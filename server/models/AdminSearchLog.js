const mongoose = require("mongoose");

const AdminSearchLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  query: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminSearchLog", AdminSearchLogSchema);
