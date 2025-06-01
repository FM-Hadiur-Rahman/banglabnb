const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const protect = require("../middleware/protect");

// Get monthly earnings for a host
router.get("/earnings", protect, async (req, res) => {
  const hostId = req.user._id;

  try {
    const data = await Booking.aggregate([
      { $match: { hostId } },
      {
        $group: {
          _id: { $month: "$dateFrom" },
          total: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          month: "$_id",
          total: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get earnings." });
  }
});

// Get monthly reviews count for a host
router.get("/reviews", protect, async (req, res) => {
  const hostId = req.user._id;

  try {
    const data = await Review.aggregate([
      { $match: { hostId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get reviews." });
  }
});

module.exports = router;
