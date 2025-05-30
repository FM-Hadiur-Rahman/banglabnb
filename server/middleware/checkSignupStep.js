// Only allow access to identity verification if user completed Step 1
const User = require("../models/User");

const checkSignupStep = async (req, res, next) => {
  console.log("🔎 Middleware received body:", req.body); // Add this for debugging
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: "User ID required." });

  const user = await User.findById(userId);
  if (!user || user.signupStep < 1) {
    return res
      .status(403)
      .json({ message: "Step 1 incomplete. Cannot proceed." });
  }

  next();
};

module.exports = checkSignupStep;
