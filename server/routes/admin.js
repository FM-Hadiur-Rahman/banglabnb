const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect"); // ✅ Correct path
const authorize = require("../middleware/authorize"); // For role check
const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

// Example admin-only route
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  const users = await User.countDocuments();
  const listings = await Listing.countDocuments();
  const bookings = await Booking.countDocuments();

  res.json({ users, listings, bookings });
});
// Get all users (Admin only)
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
// Get all listings (Admin only)
router.get("/listings", protect, authorize("admin"), async (req, res) => {
  try {
    const listings = await Listing.find().populate("hostId", "name email");
    res.json(listings);
  } catch (err) {
    console.error("❌ Failed to fetch listings:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});
// Get all bookings (Admin only)
router.get("/bookings", protect, authorize("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("guestId", "name email")
      .populate("listingId", "title location");
    res.json(bookings);
  } catch (err) {
    console.error("❌ Failed to fetch bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});
// Add to admin routes (/routes/admin.js)
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  const totalUsers = await User.countDocuments();
  const guests = await User.countDocuments({ role: "user" });
  const hosts = await User.countDocuments({ role: "host" });
  const totalListings = await Listing.countDocuments();
  const totalBookings = await Booking.countDocuments({ paymentStatus: "paid" });

  const revenue = await Booking.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$paidAmount" } } },
  ]);

  res.json({
    users: totalUsers,
    guests,
    hosts,
    listings: totalListings,
    bookings: totalBookings,
    revenue: revenue[0]?.total || 0,
  });
});
router.get("/kyc", protect, authorize("admin"), async (req, res) => {
  const pending = await User.find({ kycStatus: "pending" });
  const approved = await User.find({ kycStatus: "approved" });
  const rejected = await User.find({ kycStatus: "rejected" });

  res.json({ pending, approved, rejected });
});

router.put(
  "/kyc/:id/:status",
  protect,
  authorize("admin"),
  async (req, res) => {
    const { id, status } = req.params;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await User.findByIdAndUpdate(id, { kycStatus: status });
    res.json({ message: `KYC ${status}` });
  }
);
// Flagged listings
router.get(
  "/flagged/listings",
  protect,
  authorize("admin"),
  async (req, res) => {
    const flagged = await Listing.find({ flagged: true }).populate("hostId");
    res.json(flagged);
  }
);

// Flagged reviews
const Review = require("../models/Review");
router.get(
  "/flagged/reviews",
  protect,
  authorize("admin"),
  async (req, res) => {
    const flagged = await Review.find({ flagged: true })
      .populate("userId")
      .populate("listingId");
    res.json(flagged);
  }
);

// Flagged users
router.get("/flagged/users", protect, authorize("admin"), async (req, res) => {
  const flagged = await User.find({ flagged: true });
  res.json(flagged);
});
router.put("/users/:id/role", protect, authorize("admin"), async (req, res) => {
  const { role } = req.body;
  if (!["user", "host", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  res.json({ message: `User role updated to ${role}`, user });
});

router.get("/user-breakdown", protect, authorize("admin"), async (req, res) => {
  const total = await User.countDocuments();
  const guests = await User.countDocuments({ role: "guest" });
  const hosts = await User.countDocuments({ role: "host" });

  res.json({ total, guests, hosts });
});

// Get users with pending KYC
router.get("/kyc/pending", protect, authorize("admin"), async (req, res) => {
  const users = await User.find({ "kyc.status": "pending" });
  res.json(users);
});

// Update KYC status
router.patch("/kyc/:userId", protect, authorize("admin"), async (req, res) => {
  const { userId } = req.params;
  const { status, reason } = req.body;

  const updates = {
    "kyc.status": status,
    ...(status === "rejected" && { "kyc.rejectionReason": reason }),
  };

  await User.findByIdAndUpdate(userId, updates);
  res.json({ message: `User KYC marked as ${status}` });
});
// GET: fetch all flagged reviews, listings, and users
router.get("/flagged", protect, authorize("admin"), async (req, res) => {
  const users = await User.find({ flagged: true }).select("name email role");
  const listings = await Listing.find({ flagged: true }).populate(
    "hostId",
    "name email"
  );
  const reviews = await Review.find({ flagged: true })
    .populate("userId", "name email")
    .populate("listingId", "title");

  res.json({ users, listings, reviews });
});
// PUT: unflag an item
router.put(
  "/unflag/:type/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    const { type, id } = req.params;
    let item;

    if (type === "user")
      item = await User.findByIdAndUpdate(id, { flagged: false });
    else if (type === "listing")
      item = await Listing.findByIdAndUpdate(id, { flagged: false });
    else if (type === "review")
      item = await Review.findByIdAndUpdate(id, { flagged: false });
    else return res.status(400).json({ message: "Invalid type" });

    res.json({ message: "✅ Unflagged", item });
  }
);

module.exports = router;
