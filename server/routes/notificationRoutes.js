const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");

const {
  getNotifications,
  markAllAsRead,
  getUnreadCount,
} = require("../controllers/notificationController");
const checkMaintenance = require("../middleware/checkMaintenance");

router.get("/", protect, getNotifications);
router.patch("/mark-all-read", protect, markAllAsRead);
router.get("/unread-count", protect, checkMaintenance, getUnreadCount); // ✅ Clean

module.exports = router;
