const mongoose = require("mongoose");

const tripReservationSchema = new mongoose.Schema({
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
  totalAmount: {
    type: Number,
    required: true,
  },
  farePerSeat: Number,
  subtotal: Number,
  serviceFee: Number,
  vat: Number,
  totalAmount: Number,

  valId: String,
  paidAt: Date,
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
});

module.exports = mongoose.model("TripReservation", tripReservationSchema);
