const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    vehicleType: { type: String, enum: ["car", "bike"], required: true },
    vehicleModel: { type: String },
    licensePlate: { type: String },
    status: {
      type: String,
      enum: ["available", "booked", "cancelled"],
      default: "available",
    },

    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    seatsAvailable: { type: Number, required: true },

    farePerSeat: { type: Number, required: true },
    image: { type: String },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Location (GeoJSON + address for display)
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
      address: { type: String }, // ✅ Add for UI display (optional but useful)
    },
  },
  { timestamps: true }
);

// ✅ Create geospatial index
tripSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Trip", tripSchema);
