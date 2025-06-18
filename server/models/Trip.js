const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ["car", "bike"],
      required: true,
    },
    vehicleModel: { type: String },
    licensePlate: { type: String },

    status: {
      type: String,
      enum: ["available", "booked", "cancelled"],
      default: "available",
    },

    passengers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seats: { type: Number, default: 1 },
        status: {
          type: String,
          enum: ["reserved", "cancelled"],
          default: "reserved",
        },
        cancelledAt: { type: Date },
      },
    ],

    farePerSeat: { type: Number, required: true },
    image: { type: String },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // GeoJSON Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: { type: String },
    },
  },
  { timestamps: true }
);

// Geospatial index for location
tripSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Trip", tripSchema);
