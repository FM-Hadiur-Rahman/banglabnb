const mongoose = require("mongoose");

const tripReservationSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
    },
    farePerSeat: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number, // farePerSeat × numberOfSeats
      required: true,
    },
    serviceFee: {
      type: Number, // 10% platform fee
      required: true,
    },
    vat: {
      type: Number, // 15% of serviceFee
      required: true,
    },
    totalAmount: {
      type: Number, // subtotal + serviceFee + vat
      required: true,
    },
    driverPayout: {
      type: Number, // subtotal (or subtotal - serviceFee)
      required: true,
    },

    valId: String,
    paidAt: Date,
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TripReservation", tripReservationSchema);
