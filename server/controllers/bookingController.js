// 📁 server/controllers/bookingController.js
const sendEmail = require("../utils/sendEmail");
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
// exports.checkIn = async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking || booking.guestId.toString() !== req.user._id.toString())
//     return res.status(403).json({ message: "Unauthorized" });

//   const now = new Date();
//   if (now < new Date(booking.dateFrom))
//     return res.status(400).json({ message: "Too early to check in" });

//   booking.checkInAt = now;
//   await booking.save();
//   res.json({ message: "Checked in", booking });
// };

// ✅ Check-out
// exports.checkOut = async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking || booking.guestId.toString() !== req.user._id.toString())
//     return res.status(403).json({ message: "Unauthorized" });

//   const now = new Date();
//   if (now < new Date(booking.dateTo))
//     return res.status(400).json({ message: "Too early to check out" });

//   booking.checkOutAt = now;
//   await booking.save();
//   res.json({ message: "Checked out", booking });
// };

exports.checkIn = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("guestId", "name email")
    .populate("listingId");

  if (!booking || booking.guestId._id.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  const now = new Date();
  if (now < new Date(booking.dateFrom))
    return res.status(400).json({ message: "Too early to check in" });

  booking.checkInAt = now;
  await booking.save();

  const host = await User.findById(booking.listingId.hostId).select(
    "name email"
  );

  // ✅ Send emails with try/catch to avoid crash
  try {
    await sendEmail({
      to: booking.guestId.email,
      subject: "✅ You’ve successfully checked in!",
      html: `<p>Hi ${booking.guestId.name},</p>
             <p>You checked into <strong>${booking.listingId.title}</strong>. Enjoy your stay!</p>`,
    });
  } catch (err) {
    console.error("❌ Failed to send guest email:", err.message);
  }

  try {
    await sendEmail({
      to: host.email,
      subject: "🏠 Guest has checked in",
      html: `<p>Hi ${host.name},</p>
             <p>Your guest <strong>${booking.guestId.name}</strong> has checked into <strong>${booking.listingId.title}</strong>.</p>`,
    });
  } catch (err) {
    console.error("❌ Failed to send host email:", err.message);
  }

  res.json({ message: "Checked in", booking });
};

exports.checkOut = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("guestId", "email name")
    .populate("listingId", "title hostId price");

  if (!booking || booking.guestId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const now = new Date();
  if (now < new Date(booking.dateTo)) {
    return res.status(400).json({ message: "Too early to check out" });
  }

  booking.checkOutAt = now;
  await booking.save();

  // 📩 Send Email to Guest
  const guestReviewLink = `${process.env.CLIENT_URL}/dashboard/reviews?booking=${booking._id}`;
  await sendEmail({
    to: booking.guestId.email,
    subject: "📝 Leave a Review for Your Stay",
    html: `
      <div style="font-family:sans-serif;">
        <h2>Thanks for staying at ${booking.listingId.title}!</h2>
        <p>Your checkout is now complete. We'd love to hear your feedback.</p>
        <a href="${guestReviewLink}" style="padding:10px 16px; background:#22c55e; color:white; border-radius:6px; text-decoration:none;">Leave a Review</a>
        <p style="font-size:12px; color:gray; margin-top:10px;">Please leave your review within 7 days.</p>
      </div>
    `,
  });

  // 📩 Send Email to Host with Earnings
  const host = await User.findById(booking.listingId.hostId).select(
    "email name"
  );
  const earnings = booking.listingId.price;
  const platformFee = earnings * 0.1;
  const payout = earnings - platformFee;

  await sendEmail({
    to: host.email,
    subject: `💰 Booking Completed: Guest Checked Out`,
    html: `
      <div style="font-family:sans-serif;">
        <h2>Your guest has checked out from <strong>${
          booking.listingId.title
        }</strong></h2>
        <p><strong>Guest:</strong> ${booking.guestId.name}</p>
        <p><strong>Total Nights:</strong> ${
          (new Date(booking.dateTo) - new Date(booking.dateFrom)) /
          (1000 * 3600 * 24)
        }</p>
        <p><strong>Total Earned:</strong> ৳${earnings.toFixed(2)}</p>
        <p><strong>Platform Fee:</strong> ৳${platformFee.toFixed(2)}</p>
        <p><strong>Payout to You:</strong> ৳${payout.toFixed(2)}</p>
        <p>We’ll process your payout shortly.</p>
      </div>
    `,
  });

  res.json({ message: "Checked out", booking });
};
