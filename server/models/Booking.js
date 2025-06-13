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
    invoiceUrl: String,
    checkedInAt: { type: Date }, // ✅ when guest checks in
    checkOutAt: { type: Date },
    payoutIssued: { type: Boolean, default: false }, // ✅ to track if host payout already scheduled

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    modificationRequest: {
      status: {
        type: String,
        enum: ["none", "requested", "accepted", "rejected"],
        default: "none",
      },
      requestedDates: {
        from: Date,
        to: Date,
      },
      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "failed"],
      default: "unpaid",
    },
    transactionId: String,
    valId: String,
    paidAmount: Number,
    paidAt: Date,

    // ✅ Extra payment tracking after modification
    extraPayment: {
      required: { type: Boolean, default: false },
      amount: { type: Number, default: 0 },

      status: {
        type: String,
        enum: [
          "pending",
          "paid",
          "not_required",
          "refund_pending",
          "refunded",
          "refund_requested",
        ],
        default: "not_required",
      },
      transactionId: { type: String, select: false },
      valId: { type: String, select: false },

      paidAt: Date,
      refundClaimed: { type: Boolean, default: false }, // ✅ new
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
