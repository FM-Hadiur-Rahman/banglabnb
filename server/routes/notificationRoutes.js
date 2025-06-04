const express = require("express");
const router = express.Router();

const { getNotifications } = require("../controllers/notificationController");
const protect = require("../middleware/protect");

router.get("/notifications", protect, getNotifications);

module.exports = router;
