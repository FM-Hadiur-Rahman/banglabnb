const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  method: {
    type: String,
    enum: ["sslcommerz", "bank", "manual"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: String, // Optional: for rejection reasons or reference IDs
});

module.exports = mongoose.model("Payout", payoutSchema);
