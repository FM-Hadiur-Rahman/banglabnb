const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discount: {
      type: Number,
      required: true,
    }, // e.g. 10 or 100

    type: {
      type: String,
      enum: ["flat", "percent"],
      default: "percent",
    }, // percent = % off, flat = fixed amount

    for: {
      type: String,
      enum: ["stay", "ride", "combined", "all"],
      default: "all",
    }, // applicable booking type

    minAmount: {
      type: Number,
      default: 0,
    }, // minimum amount required

    maxDiscount: {
      type: Number,
    }, // optional: cap on discount amount

    expiresAt: {
      type: Date,
    }, // optional expiry

    active: {
      type: Boolean,
      default: true,
    },

    usageLimit: {
      type: Number,
    }, // optional: max total usage across all users

    usedCount: {
      type: Number,
      default: 0,
    }, // auto-increment on successful use

    usersUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // store users who used this promo
  },
  { timestamps: true }
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
