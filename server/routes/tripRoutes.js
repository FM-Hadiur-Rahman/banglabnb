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
  getSuggestedTrips,
  updateTrip, // ✅ Add this
  cancelTrip,
  deleteTrip,
  markTripCompleted, // ✅ New
  getTripEarnings, // ✅ New
  getDriverStats, // ✅ New
  getTripPassengers,
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
router.get("/suggestions", getSuggestedTrips);
// ✅ Earnings for all trips of the logged-in driver
router.get("/earnings", protect, authorize("driver"), getTripEarnings);

// ✅ Stats for the driver's dashboard
router.get("/driver-stats", protect, authorize("driver"), getDriverStats);

// ✅ PUBLIC ROUTES
router.get("/", getTrips);

// ✅ DYNAMIC ROUTES — keep at the end

router.post("/:tripId/reserve", protect, reserveSeat);
router.post("/:tripId/cancel", protect, cancelReservation);
router.put("/:id", protect, upload.single("image"), updateTrip);
router.put("/:id/cancel", protect, cancelTrip);
router.delete("/trips/:id", protect, deleteTrip);

// ✅ View all passengers for a specific trip
router.get("/:id/passengers", protect, authorize("driver"), getTripPassengers);

// ✅ Mark trip as completed
router.post("/:id/complete", protect, authorize("driver"), markTripCompleted);

router.get("/:id", getTripById);

module.exports = router;
