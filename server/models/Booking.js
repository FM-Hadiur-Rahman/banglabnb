const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
    },
    checkInAt: { type: Date },
    checkOutAt: { type: Date },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // 🔄 NEW FIELDS FOR PAYMENT
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    transactionId: { type: String }, // sent to SSLCOMMERZ
    valId: { type: String }, // returned from SSLCOMMERZ
    paidAmount: { type: Number }, // optional for record
    paidAt: { type: Date }, // timestamp of payment
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
