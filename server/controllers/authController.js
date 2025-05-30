const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  console.log("🔥 Register endpoint hit");
  console.log("👉 Request body:", req.body);

  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: false,
      verificationToken,
      division,
      district,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your BanglaBnB account",
      html: `<h2>Hi ${name},</h2>
      <p>Thanks for signing up as a ${role}.</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>`,
    });

    res.status(201).json({
      message: "Check your email to verify your account.",
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

// authController.js
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: "✅ Email verified successfully!" });
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first." });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Add isVerified to response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetToken = hashedToken;
  user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;
  // Send `resetUrl` to user via email (use nodemailer/sendgrid/etc)
  // ✅ Send Email
  await sendEmail({
    to: user.email,
    subject: "🔐 Reset your password",
    html: `
    <p>Hello ${user.name},</p>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
  `,
  });

  res.json({ message: "✅ Reset link sent to your email." });
};

exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email,
    resetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: "✅ Password reset successfully!" });
};

exports.registerStep1 = async (req, res) => {
  try {
    const { name, email, password, phone, role, division, district } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      division,
      district,
      isVerified: false,
      verificationToken,
      identityVerified: false,
      signupStep: 1,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your BanglaBnB account",
      html: `<h2>Hi ${name},</h2>
      <p>Thanks for signing up as a ${role}.</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>`,
    });

    res.status(201).json({
      message: "✅ Step 1 complete. Check your email to verify your account.",
      userId: user._id,
    });
  } catch (err) {
    console.error("❌ Error in registerStep1:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.verifyIdentityHandler = async (req, res) => {
  const { userId } = req.body;
  const { idDocument, livePhoto } = req.files;

  if (!userId || !idDocument || !livePhoto)
    return res.status(400).json({ message: "Missing required files or ID." });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.idDocumentUrl = idDocument[0].path;
  user.livePhotoUrl = livePhoto[0].path;
  user.signupStep = 2;
  user.identityVerified = false;

  await user.save();

  res.status(200).json({ message: "Identity verification submitted" });
};
