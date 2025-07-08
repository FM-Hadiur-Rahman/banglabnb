const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
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
      required: true, // Final payout to host
    },
    hostFee: {
      type: Number,
      default: 0, // 5% fee deducted from host
    },
    guestFee: {
      type: Number,
      default: 0, // 10% collected from guest
    },
    vat: {
      type: Number,
      default: 0, // 15% VAT on (guestFee + hostFee)
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
    notes: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin or system user
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Payout", payoutSchema);
