const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.updateCurrentUser = async (req, res) => {
  const updates = {};
  const allowed = ["name", "phone", "avatar"];

  allowed.forEach((key) => {
    const value = req.body[key];
    if (value !== undefined && value !== "") {
      updates[key] = value;
    }
  });

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    // ✅ Optional: only regenerate token if sensitive fields change
    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile." });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
