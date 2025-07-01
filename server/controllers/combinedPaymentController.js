require("dotenv").config();
const Booking = require("../models/Booking");
const Trip = require("../models/Trip");
const User = require("../models/User");
const Listing = require("../models/Listing");
const generateInvoice = require("../utils/generateInvoice");
const sendEmail = require("../utils/sendEmail");
const qs = require("qs");
const axios = require("axios");

exports.initiateCombinedPayment = async (req, res) => {
  const { bookingId, amount } = req.body;

  const booking = await Booking.findById(bookingId)
    .populate("listingId")
    .populate("guestId");

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const transactionId = `COMBINED_${bookingId}_${Date.now()}`;
  booking.transactionId = transactionId;
  await booking.save();

  // Safely extract guest info
  const guest = booking.guestId;
  const guestName = guest?.name || "Guest";
  const guestEmail = guest?.email || "guest@example.com";
  const guestPhone = guest?.phone || "01700000000";
  const guestAddress = guest?.district || "Bangladesh";

  const postData = {
    store_id: process.env.SSLC_STORE_ID,
    store_passwd: process.env.SSLC_STORE_PASS,
    total_amount: amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${process.env.API_URL}/api/combined-payment/success`,
    fail_url: `${process.env.CLIENT_URL}/payment-fail`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    ipn_url: `${process.env.API_URL}/api/combined-payment/success`,

    cus_name: guestName,
    cus_email: guestEmail,
    cus_add1: guestAddress,
    cus_phone: guestPhone,

    product_name: booking.combined ? "Stay + Ride" : "Stay Only",
    product_category: "CombinedBooking",
    product_profile: "general",
  };

  try {
    const sslRes = await axios.post(
      process.env.SSLCOMMERZ_API_URL,
      qs.stringify(postData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (sslRes.data?.status === "SUCCESS") {
      return res.json({ gatewayUrl: sslRes.data.GatewayPageURL });
    } else {
      return res
        .status(400)
        .json({ message: "SSLCommerz initiation failed", data: sslRes.data });
    }
  } catch (err) {
    console.error("❌ SSLCommerz error:", err.message);
    res
      .status(500)
      .json({ message: "Payment gateway error", error: err.message });
  }
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
      `${process.env.CLIENT_URL}/payment-success?tran_id=${tran_id}`
    );
  } catch (err) {
    console.error("❌ Combined Payment success error:", err);
    res.status(500).send("Server error");
  }
};
