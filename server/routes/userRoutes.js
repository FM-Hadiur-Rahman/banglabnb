const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  updateCurrentUser,
  getCurrentUser,
} = require("../controllers/userController");

router.patch("/me", protect, updateCurrentUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;
