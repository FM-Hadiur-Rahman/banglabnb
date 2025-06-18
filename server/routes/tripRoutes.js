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
  cancelReservation,
} = require("../controllers/tripController");

// ✅ CREATE trip (with image upload)
router.post(
  "/",
  protect,
  authorize("driver"),
  upload.single("image"),
  createTrip
);

// ✅ STATIC ROUTES — define BEFORE dynamic ones
router.get("/my-rides", protect, MyRides); // must come before `/:id`
router.get("/my", protect, authorize("driver"), getMyTrips);

// ✅ PUBLIC ROUTES
router.get("/", getTrips);

// ✅ DYNAMIC ROUTES — keep at the end
router.post("/:tripId/reserve", protect, reserveSeat);
router.post("/:tripId/cancel", protect, cancelReservation);
router.get("/:id", getTripById);

module.exports = router;
