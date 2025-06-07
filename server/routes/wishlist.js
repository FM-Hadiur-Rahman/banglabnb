const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");
const protect = require("../middleware/protect");

// Add to wishlist
router.post("/add/:listingId", protect, async (req, res) => {
  try {
    const { listingId } = req.params;

    // Validate listing existence (optional but recommended)
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.wishlist.includes(listingId)) {
      user.wishlist.push(listingId);
      await user.save();
    }

    res.json({ message: "✅ Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("❌ Wishlist add error:", err);
    res.status(500).json({ message: "Wishlist update failed" });
  }
});

// Remove from wishlist
router.delete("/remove/:listingId", protect, async (req, res) => {
  try {
    const { listingId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== listingId.toString()
    );
    await user.save();

    res.json({ message: "✅ Removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("❌ Wishlist remove error:", err);
    res.status(500).json({ message: "Wishlist update failed" });
  }
});

// Get wishlist
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.wishlist);
  } catch (err) {
    console.error("❌ Fetch wishlist error:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

module.exports = router;
