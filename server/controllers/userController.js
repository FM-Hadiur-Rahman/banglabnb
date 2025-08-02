const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.updateCurrentUser = async (req, res) => {
  const updates = {};
  const allowed = ["name", "phone", "avatar", "email", "password", "role"];

  allowed.forEach((key) => {
    const value = req.body[key];
    if (value !== undefined && value !== "") {
      updates[key] = value;
    }
  });

  try {
    const userBefore = await User.findById(req.user._id).select("-password");

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    // Only regenerate token if sensitive fields changed
    const sensitiveFields = ["email", "password", "role"];
    const hasSensitiveChange = sensitiveFields.some(
      (key) => updates[key] && updates[key] !== userBefore[key]
    );

    let token;
    if (hasSensitiveChange) {
      token = generateToken(user);
    }

    res.json({ user, token }); // token is optional
  } catch (err) {
    console.error("❌ Failed to update user:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
exports.getPaymentDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("paymentDetails");
    res.json(user.paymentDetails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payment details" });
  }
};

exports.updatePaymentDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.paymentDetails = req.body; // Validate if needed
    user.paymentDetails.verified = false; // Reset verification
    await user.save();
    res.json({
      message: "✅ Payment details updated",
      paymentDetails: user.paymentDetails,
    });
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ message: "Failed to update payment details" });
  }
};
