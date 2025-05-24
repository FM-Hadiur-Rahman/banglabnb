const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const bookingCtrl = require("../controllers/bookingController");

// Create a booking (guests)
router.post("/", protect, bookingCtrl.createBooking);

// Get bookings for a guest
router.get("/user", protect, bookingCtrl.getBookingsByGuest);

// Get bookings for host's listings
router.get("/host", protect, bookingCtrl.getBookingsByHost);

// Cancel a booking
router.put("/:id/cancel", protect, bookingCtrl.cancelBooking);

module.exports = router;
