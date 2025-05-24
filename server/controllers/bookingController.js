// 📁 server/controllers/bookingController.js
const sendEmail = require("../utils/sendEmail");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const User = require("../models/User");

// ✅ Create a new booking (guest)

exports.createBooking = async (req, res) => {
  const { listingId, dateFrom, dateTo } = req.body;

  try {
    const newBooking = await Booking.create({
      guestId: req.user.id,
      listingId,
      dateFrom,
      dateTo,
    });

    // ✅ Fetch guest and listing details for email
    const guest = await User.findById(req.user.id);
    const listing = await Listing.findById(listingId);

    if (guest && listing) {
      await sendEmail(
        guest.email,
        "Your BanglaBnB Booking is Confirmed!",
        `
          <h2>Hi ${guest.name},</h2>
          <p>✅ Your booking at <strong>${
            listing.title
          }</strong> is confirmed.</p>
          <p>📍 Location: ${listing.location}</p>
          <p>📅 Dates: ${new Date(dateFrom).toLocaleDateString()} → ${new Date(
          dateTo
        ).toLocaleDateString()}</p>
          <p>Thank you for choosing BanglaBnB!</p>
        `
      );
    }

    res.status(201).json(newBooking);
  } catch (err) {
    console.error("❌ Booking failed:", err); // Optional: add this to debug
    res
      .status(500)
      .json({ message: "Failed to create booking", error: err.message });
  }
};

// ✅ Get all bookings made by the current user (guest)
exports.getBookingsByGuest = async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.user.id })
      .populate("listingId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
};

// ✅ Get all bookings for listings owned by the current host
exports.getBookingsByHost = async (req, res) => {
  try {
    const hostListings = await Listing.find({ hostId: req.user.id });
    const listingIds = hostListings.map((l) => l._id);
    const bookings = await Booking.find({ listingId: { $in: listingIds } })
      .populate("guestId")
      .populate("listingId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch host bookings", error: err.message });
  }
};

// ✅ Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Guest or host can cancel
    if (
      booking.guestId.toString() !== req.user.id &&
      req.user.role !== "host"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to cancel booking", error: err.message });
  }
};
