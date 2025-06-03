const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/protect");

// Update current user
router.patch("/me", protect, async (req, res) => {
  const updates = {};
  const allowed = ["name", "phone", "avatar"];

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile." });
  }
});

module.exports = router;
