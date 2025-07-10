const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },

    fromLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true }, // [lng, lat]
      address: { type: String }, // Optional full address
    },
    toLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true },
      address: { type: String },
    },
    date: { type: String, required: true },
    time: { type: String, required: true },

    totalSeats: { type: Number, required: true, min: 1 },
    farePerSeat: { type: Number, required: true, min: 0 },

    passengers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seats: { type: Number, default: 1 },
        status: {
          type: String,
          enum: ["reserved", "cancelled"],
          default: "reserved",
        },
        cancelledAt: Date,
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "failed"],
          default: "pending",
        },
        transactionId: { type: String },
      },
    ],

    vehicleType: { type: String, enum: ["car", "bike"], required: true },
    vehicleModel: { type: String },
    licensePlate: { type: String },

    status: {
      type: String,
      enum: ["available", "booked", "cancelled"],
      default: "available",
    },
    departureAt: { type: Date },
    cancelReason: { type: String },
    cancelledAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    image: { type: String },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false, // ✅ make optional
      },
      address: {
        type: String,
      },
    },
  },
  { timestamps: true }
);
tripSchema.index({ "fromLocation.coordinates": "2dsphere" });
tripSchema.index({ "toLocation.coordinates": "2dsphere" });
tripSchema.index({ "location.coordinates": "2dsphere" });

tripSchema.virtual("seatsAvailable").get(function () {
  const reservedSeats = this.passengers
    .filter((p) => p.status === "reserved")
    .reduce((sum, p) => sum + (p.seats || 1), 0);
  return this.totalSeats - reservedSeats;
});

module.exports = mongoose.model("Trip", tripSchema);
