const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");
const protect = require("../middleware/protect");

// Add to wishlist
router.post("/add/:listingId", protect, async (req, res) => {
  const { listingId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user.wishlist.includes(listingId)) {
    user.wishlist.push(listingId);
    await user.save();
  }

  res.json({ message: "Added to wishlist" });
});

// Remove from wishlist
router.delete("/remove/:listingId", protect, async (req, res) => {
  const { listingId } = req.params;
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== listingId.toString()
  );
  await user.save();

  res.json({ message: "Removed from wishlist" });
});

// Get wishlist
router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
});

module.exports = router;
