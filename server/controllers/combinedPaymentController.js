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
  const { bookingId, amount, customer } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const transactionId = `COMBINED_${bookingId}_${Date.now()}`;
    booking.transactionId = transactionId;
    await booking.save();

    const data = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASS,
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.API_URL}/api/combined-payment/success`,
      fail_url: `${process.env.CLIENT_URL}/payment-fail`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      ipn_url: `${process.env.API_URL}/api/combined-payment/ipn`,
      cus_name: customer?.name || "Guest",
      cus_email: customer?.email || "guest@example.com",
      cus_add1: customer?.address || "Bangladesh",
      cus_city: "Dhaka",
      cus_postcode: "1200",
      cus_country: "Bangladesh",
      cus_phone: customer?.phone || "01700000000",
      shipping_method: "NO",
      product_name: "BanglaBnB Stay + Ride",
      product_category: "Combined",
      product_profile: "general",
    };

    const response = await axios.post(
      process.env.SSLCOMMERZ_API_URL,
      qs.stringify(data),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!response.data.GatewayPageURL) {
      return res.status(400).json({
        message: "SSLCommerz initiation failed",
        data: response.data,
      });
    }

    return res.json({ gatewayUrl: response.data.GatewayPageURL });
  } catch (err) {
    console.error("❌ SSLCommerz initiation error:", err.message);
    return res
      .status(500)
      .json({ message: "Payment initiation failed", error: err.message });
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
