const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const bookingCtrl = require("../controllers/bookingController");
const path = require("path");
const fs = require("fs");

// Create a booking (guests)
router.post("/", protect, bookingCtrl.createBooking);

// Get bookings for a guest
router.get("/user", protect, bookingCtrl.getBookingsByGuest);

// Get bookings for host's listings
router.get("/host", protect, bookingCtrl.getBookingsByHost);
router.get("/listing/:listingId", bookingCtrl.getBookingsForListing);

// Accept a booking
router.put("/:id/accept", protect, bookingCtrl.acceptBooking);

// Cancel a booking
router.put("/:id/cancel", protect, bookingCtrl.cancelBooking);

// Check-in / Check-out
router.patch("/:id/checkin", protect, bookingCtrl.checkIn);
router.patch("/:id/checkout", protect, bookingCtrl.checkOut);
//Modification of booking
router.patch(
  "/:id/request-modification",
  protect,
  bookingCtrl.requestModification
);
router.patch(
  "/:id/respond-modification",
  protect,
  bookingCtrl.respondModification
);

// ✅ Download invoice
router.get("/:id/invoice", protect, async (req, res) => {
  const invoicePath = path.join(
    __dirname,
    "../invoices",
    `invoice-${req.params.id}.pdf`
  );
  if (fs.existsSync(invoicePath)) {
    res.sendFile(invoicePath);
  } else {
    res.status(404).json({ message: "Invoice not found" });
  }
});

router.get("/:bookingId/invoice", protect, async (req, res) => {
  const invoicePath = path.join(
    __dirname,
    `../invoices/invoice-${req.params.bookingId}.pdf`
  );

  if (!fs.existsSync(invoicePath)) {
    return res.status(404).send("Invoice not found");
  }

  res.download(invoicePath); // triggers file download
});

module.exports = router;
