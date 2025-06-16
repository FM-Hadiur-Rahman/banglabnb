const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");
const {
  createTrip,
  getTrips,
  getMyTrips, // 👈 add this
} = require("../controllers/tripController");

router.post("/", protect, authorize("driver"), createTrip);
router.get("/", getTrips);
router.get("/my", protect, authorize("driver"), getMyTrips); // ✅ this is the missing route

module.exports = router;
