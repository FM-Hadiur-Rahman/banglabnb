// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // ✅ Add this line
    },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["booking", "payment", "system", "modification-request"],
      default: "system",
    },
    link: { type: String }, // ✅ optional but recommended to keep
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
