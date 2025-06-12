// 📁 server/models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // Prevent multiple reviews per booking
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    verified: {
      type: Boolean,
      default: true, // you can set to false if you want moderation
    },
    tags: [String], // e.g., ['clean', 'friendly', 'peaceful']
    emoji: String, // optional emoji representing experience

    text: String,
    response: String, // 📝 Host reply
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
