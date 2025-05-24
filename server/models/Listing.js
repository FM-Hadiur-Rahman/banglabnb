const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    coordinates: {
      type: [Number], // [lng, lat]
      index: "2dsphere",
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
      default: 2,
    },

    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
