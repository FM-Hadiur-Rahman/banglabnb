const mongoose = require("mongoose");

const promocodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ["flat", "percent"], required: true },
  amount: { type: Number, required: true }, // amount or percentage
  maxUses: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date },
  minBookingAmount: { type: Number, default: 0 },
  applicableTo: {
    type: String,
    enum: ["stay", "ride", "both"],
    default: "both",
  },
});

module.exports = mongoose.model("Promocode", promocodeSchema);
