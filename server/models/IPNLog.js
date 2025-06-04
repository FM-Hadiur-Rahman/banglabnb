const mongoose = require("mongoose");

const ipnLogSchema = new mongoose.Schema(
  {
    payload: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("IPNLog", ipnLogSchema);
