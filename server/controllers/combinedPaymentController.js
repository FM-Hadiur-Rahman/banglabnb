const Booking = require("../models/Booking");
const Trip = require("../models/Trip");
const User = require("../models/User");
const Listing = require("../models/Listing");
const generateInvoice = require("../utils/generateInvoice");
const sendEmail = require("../utils/sendEmail");

exports.initiateCombinedPayment = async (req, res) => {
  const { bookingId, amount } = req.body;

  const booking = await Booking.findById(bookingId).populate("listingId");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const { _id, guestId, tripId, combined } = booking;

  const transactionId = `COMBINED_${bookingId}_${Date.now()}`;
  booking.transactionId = transactionId;
  await booking.save();

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${process.env.API_URL}/api/combined-payment/success`,
    fail_url: `${process.env.CLIENT_URL}/payment-fail`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    ipn_url: `${process.env.API_URL}/api/combined-payment/success`,

    cus_name: guestId?.name || "Guest",
    cus_email: guestId?.email || "guest@email.com",
    cus_add1: "Bangladesh",
    cus_phone: guestId?.phone || "0000",

    product_name: combined ? "Stay + Ride" : "Stay Only",
    product_category: "CombinedBooking",
    product_profile: "general",
  };

  const sslcz = new SSLCommerzPayment(
    process.env.SSLC_STORE_ID,
    process.env.SSLC_STORE_PASS,
    false
  );
  sslcz.init(data).then((apiResponse) => {
    return res.json({ gatewayUrl: apiResponse.GatewayPageURL });
  });
};
exports.combinedPaymentSuccess = async (req, res) => {
  const { tran_id, val_id, amount } = req.body;

  try {
    const booking = await Booking.findOne({ transactionId: tran_id });
    if (!booking) return res.status(404).send("Booking not found");

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.valId = val_id;
    booking.paidAmount = amount;
    booking.paidAt = new Date();
    await booking.save();

    // Fetch related info
    const guest = await User.findById(booking.guestId);
    const listing = await Listing.findById(booking.listingId);
    const trip = booking.tripId ? await Trip.findById(booking.tripId) : null;

    const invoicePath = await generateInvoice(
      booking,
      listing,
      guest,
      null,
      trip
    );

    await sendEmail({
      to: guest.email,
      subject: "🧾 Your Combined BanglaBnB Invoice",
      html: `
        <p>Dear ${guest.name},</p>
        <p>Your combined booking (Stay + Ride) is confirmed. Thank you for using BanglaBnB!</p>
        <p>📎 Invoice is attached to this email.</p>
      `,
      attachments: [
        {
          filename: `invoice-${booking._id}.pdf`,
          path: invoicePath,
        },
      ],
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?tran_id=${tran_id}`
    );
  } catch (err) {
    console.error("❌ Combined Payment success error:", err);
    res.status(500).send("Server error");
  }
};
