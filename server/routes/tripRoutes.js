const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/cloudinaryUpload");

const {
  createTrip,
  getTrips,
  getMyTrips,
  getTripById,
  reserveSeat,
  MyRides,
} = require("../controllers/tripController");

// 👇 Add upload.single("image") middleware for handling vehicle image
router.post(
  "/",
  protect,
  authorize("driver"),
  upload.single("image"),
  createTrip
);

router.get("/", getTrips);
router.get("/my", protect, authorize("driver"), getMyTrips);
router.get("/:id", getTripById);
router.post("/:tripId/reserve", protect, reserveSeat);
// GET /api/trips/my-rides
router.get("/my-rides", protect, MyRides);

module.exports = router;
