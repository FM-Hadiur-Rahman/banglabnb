// === routes/rideRoutes.js ===
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");
const { bookRide } = require("../controllers/rideController");

router.post("/", protect, bookRide);

module.exports = router;
