const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const notificationCtrl = require("../controllers/notificationController");

// GET /api/notifications - fetch user notifications
router.get("/", protect, notificationCtrl.getNotifications);

module.exports = router;
