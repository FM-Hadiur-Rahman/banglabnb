const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", authCtrl.verifyEmail);

module.exports = router;
