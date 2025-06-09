const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const { cloudinary } = require("../config/cloudinary"); // adjust the path if needed

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

    // ✅ Generate token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      division,
      district,
      isVerified: false,
      verificationToken: hashedToken, // ✅ save hashed token
      identityVerified: false,
      signupStep: 1,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`; // ✅ send raw token in URL

    await sendEmail({
      to: email,
      subject: "Verify your BanglaBnB account",
      html: `<h2>Hi ${name},</h2>
      <p>Thanks for signing up as a ${role}.</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email, by clicking this link</a>`,
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
  const { userId, livePhotoBase64 } = req.body;
  const { idDocument, idBack, livePhoto } = req.files || {};

  if (!userId || !idDocument || !idBack) {
    return res
      .status(400)
      .json({ message: "Missing required ID document, ID back, or user ID." });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ ID Front & Back via multer (already handled by Cloudinary)
  user.idDocumentUrl = idDocument[0].path; // Front side
  user.idBackUrl = idBack[0].path; // ✅ Back side (NEW)

  // ✅ Live photo via file or base64
  if (livePhoto && livePhoto[0]) {
    user.livePhotoUrl = livePhoto[0].path;
  } else if (livePhotoBase64) {
    try {
      const result = await cloudinary.uploader.upload(livePhotoBase64, {
        folder: "banglabnb/verifications",
        public_id: `livePhoto-${Date.now()}`,
      });
      user.livePhotoUrl = result.secure_url;
    } catch (err) {
      console.error("❌ Cloudinary base64 upload failed:", err.message);
      return res.status(500).json({ message: "Failed to upload selfie image" });
    }
  } else {
    return res.status(400).json({ message: "Live photo is required" });
  }

  user.signupStep = 2;
  user.identityVerified = false;

  await user.save();
  res.status(200).json({ message: "Identity verification submitted" });
};

// authController.js

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ verificationToken: hashedToken });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({
    message: "✅ Email verified successfully!",
    userId: user._id,
  });
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
      token: generateToken(user),
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

// PATCH /api/auth/switch-role
exports.switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "user" ? "host" : "user";

    await user.save({ validateBeforeSave: false }); // ✅ Skip full validation

    res.json({ message: "Role switched", newRole: user.role });
  } catch (error) {
    console.error("Role switch error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
