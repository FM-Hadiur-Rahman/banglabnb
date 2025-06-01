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
router.get("/listing/:listingId", bookingCtrl.getBookingsForListing);

// accept a booking
router.put("/:id/accept", protect, bookingCtrl.acceptBooking); // ✅ Add this line

// Cancel a booking
router.put("/:id/cancel", protect, bookingCtrl.cancelBooking);

router.patch("/:id/checkin", protect, bookingCtrl.checkIn);
router.patch("/:id/checkout", protect, bookingCtrl.checkOut);

module.exports = router;
