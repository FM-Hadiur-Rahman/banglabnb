const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    vehicleType: { type: String, enum: ["car", "bike"], required: true },

    vehicleModel: { type: String, required: true },
    licensePlate: { type: String, required: true },
    image: { type: String }, // optional image URL

    seatsAvailable: { type: Number, required: true },
    farePerSeat: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["available", "booked", "cancelled"],
      default: "available",
    },
  },
  { timestamps: true }
);
