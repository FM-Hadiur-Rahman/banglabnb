const mongoose = require("mongoose");
const { divisions } = require("../data/districts");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
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
      address: {
        type: String,
        required: true,
      },
    },

    maxGuests: {
      type: Number,
      required: true,
      default: 2,
    },

    division: {
      type: String,
      required: true,
      enum: Object.keys(divisions),
    },

    district: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return Object.values(divisions).flat().includes(value);
        },
        message: (props) => `${props.value} is not a valid district.`,
      },
    },

    roomType: {
      type: String,
      required: true,
      enum: ["Hotel", "Resort", "Guest House", "Personal Property", "Other"],
    },
    description: {
      type: String,
      default: "",
    },
    houseRules: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
      enum: ["AC", "Wifi", "Sea View", "Resort", "Family Friendly"],
    },

    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedDates: [
      {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
      },
    ],
    // models/Listing.js
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
