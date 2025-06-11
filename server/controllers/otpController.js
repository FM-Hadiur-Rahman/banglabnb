const User = require("../models/User");

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  const user = await User.findById(req.user._id);
  user.phone = phone;
  user.otpCode = otp;
  user.otpExpires = expires;
  await user.save();

  // 🚨 Replace this with SMS sending via SSLWireless/Twilio
  console.log(`✅ OTP for ${phone}:`, otp);

  res.json({ message: "OTP sent to your phone" });
};

exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user._id);

  if (!user || !user.otpCode || !user.otpExpires)
    return res.status(400).json({ message: "No OTP request found." });

  if (user.otpCode !== otp)
    return res.status(400).json({ message: "Incorrect OTP" });

  if (Date.now() > user.otpExpires)
    return res.status(400).json({ message: "OTP expired" });

  user.phoneVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "✅ Phone number verified!" });
};
