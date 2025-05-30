const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinaryUpload");

const checkSignupStep = require("../middleware/checkSignupStep");

const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  registerStep1,
  verifyIdentityHandler,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/register-step1", registerStep1);

router.post(
  "/verify-identity",
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "livePhoto", maxCount: 1 },
  ]),
  checkSignupStep, // ✅ run AFTER multer parses body
  verifyIdentityHandler
);

router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
// routes/authRoutes.js
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
