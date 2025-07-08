const mongoose = require("mongoose");

const driverPayoutSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true, // Final payout to driver (e.g. subtotal or 90% of total)
    },
    serviceFee: {
      type: Number, // 10% BanglaBnB fee
      default: 0,
    },
    vat: {
      type: Number, // 15% of serviceFee
      default: 0,
    },
    method: {
      type: String,
      enum: ["manual", "sslcommerz", "bank"],
      default: "manual",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    notes: String,
    paidAt: Date,
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DriverPayout", driverPayoutSchema);
