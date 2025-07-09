const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const protect = require("../middleware/protect");

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

router.get("/host/:id", protect, async (req, res) => {
  const hostId = req.params.id;

  try {
    const [earningsData, reviewsData] = await Promise.all([
      Booking.aggregate([
        {
          $lookup: {
            from: "listings",
            localField: "listingId",
            foreignField: "_id",
            as: "listing",
          },
        },
        { $unwind: "$listing" },
        {
          $match: {
            "listing.hostId": hostId,
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: { $month: "$dateFrom" },
            total: { $sum: "$paidAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Review.aggregate([
        {
          $lookup: {
            from: "listings",
            localField: "listingId",
            foreignField: "_id",
            as: "listing",
          },
        },
        { $unwind: "$listing" },
        {
          $match: {
            "listing.hostId": hostId,
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // 🧠 Pad missing months with 0
    const fullEarnings = MONTH_NAMES.map((name, i) => {
      const monthData = earningsData.find((m) => m._id === i + 1);
      return {
        month: name,
        amount: monthData ? monthData.total : 0, // ✅ renamed to amount
      };
    });

    const fullReviews = MONTH_NAMES.map((name, i) => {
      const monthData = reviewsData.find((m) => m._id === i + 1);
      return {
        month: name,
        count: monthData ? monthData.count : 0,
      };
    });

    res.json({
      earnings: fullEarnings,
      reviews: fullReviews,
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ error: "Failed to fetch host stats." });
  }
});

module.exports = router;
