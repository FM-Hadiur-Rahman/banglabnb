const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Booking = require("../models/Booking");
const protect = require("../middleware/protect");
const generateInvoice = require("../utils/generateInvoice"); // make sure this path is correct

// 📥 GET /api/invoices/:bookingId
router.get("/:bookingId", protect, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  try {
    const booking = await Booking.findById(bookingId)
      .populate("guestId")
      .populate("listingId");

    if (!booking) return res.status(404).send("Booking not found");

    const isGuest = booking.guestId._id.equals(userId);
    const isHost = booking.listingId.hostId?.equals(userId);

    if (!isGuest && !isHost) {
      return res.status(403).send("Unauthorized to access this invoice");
    }

    // 🧾 Set headers to download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=BanglaBnB-Invoice-${booking._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // 🪄 Regenerate and stream to browser
    await generateInvoice(booking, booking.listingId, booking.guestId, res);
  } catch (err) {
    console.error("❌ Invoice generation error:", err);
    res.status(500).send("Failed to generate invoice");
  }
});

module.exports = router;
