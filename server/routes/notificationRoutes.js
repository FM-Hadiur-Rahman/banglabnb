const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAllAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/protect");

router.get("/", protect, getNotifications);
router.patch("/mark-all-read", protect, markAllAsRead); // ✅ NEW

module.exports = router;
