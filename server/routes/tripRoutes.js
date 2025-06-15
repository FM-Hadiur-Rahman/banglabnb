// === routes/tripRoutes.js ===
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");
const { createTrip, getTrips } = require("../controllers/tripController");
const authorize = require("../middleware/authorize");

router.post("/", protect, authorize("driver"), createTrip);
router.get("/", getTrips);

module.exports = router;
