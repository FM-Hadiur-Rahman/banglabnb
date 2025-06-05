const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Booking = require("../models/Booking");
const protect = require("../middlewares/protect");

// 📥 GET /api/invoices/:bookingId
router.get("/:bookingId", protect, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id; // from isAuthenticated middleware

  try {
    const booking = await Booking.findById(bookingId)
      .populate("guestId")
      .populate("listingId");

    if (!booking) return res.status(404).send("Booking not found");

    // 🔐 Access Control: guest or host only
    const isGuest = booking.guestId._id.equals(userId);
    const isHost = booking.listingId.hostId?.equals(userId);

    if (!isGuest && !isHost) {
      return res.status(403).send("Unauthorized to access this invoice");
    }

    const invoicePath = path.join(
      __dirname,
      `../invoices/invoice-${booking._id}.pdf`
    );

    if (!fs.existsSync(invoicePath)) {
      return res.status(404).send("Invoice not generated yet.");
    }

    res.download(invoicePath, `BanglaBnB-Invoice-${booking._id}.pdf`);
  } catch (err) {
    console.error("❌ Invoice download error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
