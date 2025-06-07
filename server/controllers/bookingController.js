// 📁 server/controllers/bookingController.js
//const sendEmail = require("../utils/sendEmail");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const User = require("../models/User");

// ✅ Create a new booking (guest)

exports.createBooking = async (req, res) => {
  const { listingId, dateFrom, dateTo } = req.body;

  try {
    const today = new Date();
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    // ❌ Prevent past or invalid date ranges
    if (from < today || to <= from) {
      return res
        .status(400)
        .json({ message: "Invalid booking dates. Cannot book in the past." });
    }

    // ❌ Prevent overlapping bookings
    const overlapping = await Booking.findOne({
      listingId,
      status: { $ne: "cancelled" },
      $or: [{ dateFrom: { $lte: to }, dateTo: { $gte: from } }],
    });

    if (overlapping) {
      return res
        .status(409)
        .json({ message: "This listing is already booked for those dates." });
    }

    // ✅ Create the booking
    const newBooking = await Booking.create({
      guestId: req.user._id,
      listingId,
      dateFrom,
      dateTo,
    });

    res.status(201).json(newBooking);
  } catch (err) {
    console.error("❌ Booking failed:", err);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: err.message });
  }
};

// ✅ Get all bookings made by the current user (guest)
exports.getBookingsByGuest = async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.user._id })
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
    const hostListings = await Listing.find({ hostId: req.user._id });
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

exports.getBookingsForListing = async (req, res) => {
  try {
    const bookings = await Booking.find({
      listingId: req.params.listingId,
      status: { $ne: "cancelled" },
    }).select("dateFrom dateTo");

    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
};

// ✅ Accept a booking
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params._id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only host can accept
    const listing = await Listing.findById(booking.listingId);
    if (listing.hostId.toString() !== req.user._id)
      return res.status(403).json({ message: "Not authorized" });

    booking.status = "confirmed";
    await booking.save();
    // Fetch guest to get email
    const guest = await User.findById(booking.guestId);

    await sendEmail({
      to: guest.email,
      subject: "🎉 Your booking has been accepted!",
      html: `
    <h3>Hi ${guest.name},</h3>
    <p>Your booking for <strong>${listing.title}</strong> has been <span style="color:green;"><b>accepted</b></span> by the host.</p>
    <p>We look forward to hosting you!</p>
    <p>BanglaBnB Team</p>
  `,
    });

    res.json({ message: "Booking accepted" });
  } catch (err) {
    console.error("❌ Accept failed:", err);
    res.status(500).json({ message: "Failed to accept booking" });
  }
};

// ✅ Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params._id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Find the listing to check host ownership
    const listing = await Listing.findById(booking.listingId);
    const isHost = listing.hostId.toString() === req.user._id;
    const isGuest = booking.guestId.toString() === req.user._id;

    if (!isHost && !isGuest) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    const guest = await User.findById(booking.guestId);
    const host = await User.findById(listing.hostId);

    const recipient = isHost ? guest.email : host.email;
    const cancelerName = isHost ? host.name : guest.name;

    await sendEmail({
      to: recipient,
      subject: "❌ Booking Cancelled",
      html: `
    <h3>Hello,</h3>
    <p>The booking for <strong>${listing.title}</strong> has been <span style="color:red;"><b>cancelled</b></span> by ${cancelerName}.</p>
    <p>If this was a mistake, please reach out to the other party directly.</p>
    <p>BanglaBnB Team</p>
  `,
    });

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("❌ Cancel failed:", err);
    res
      .status(500)
      .json({ message: "Failed to cancel booking", error: err.message });
  }
};

// ✅ Check-in
exports.checkIn = async (req, res) => {
  const booking = await Booking.findById(req.params._id);
  if (!booking || booking.guestId.toString() !== req.user._id)
    return res.status(403).json({ message: "Unauthorized" });

  const now = new Date();
  if (now < new Date(booking.dateFrom))
    return res.status(400).json({ message: "Too early to check in" });

  booking.checkInAt = now;
  await booking.save();
  res.json({ message: "Checked in", booking });
};

// ✅ Check-out
exports.checkOut = async (req, res) => {
  const booking = await Booking.findById(req.params._id);
  if (!booking || booking.guestId.toString() !== req.user._id)
    return res.status(403).json({ message: "Unauthorized" });

  const now = new Date();
  if (now < new Date(booking.dateTo))
    return res.status(400).json({ message: "Too early to check out" });

  booking.checkOutAt = now;
  await booking.save();
  res.json({ message: "Checked out", booking });
};
