const express = require("express");
const axios = require("axios");
const router = express.Router();
const Booking = require("../models/Booking"); // 🔄 Import your Booking model
require("dotenv").config();

router.post("/initiate", async (req, res) => {
  const { amount, bookingId, customer } = req.body;

  // 1. Generate transaction ID
  const tran_id = `BNB_${bookingId}_${Date.now()}`;

  // 2. Save transaction ID to booking
  await Booking.findByIdAndUpdate(bookingId, {
    transactionId: tran_id,
    paymentStatus: "unpaid",
  });

  const data = {
    store_id: process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASS,
    total_amount: amount,
    currency: "BDT",
    tran_id, // ✅ use saved one
    success_url: "https://banglabnb.com/payment-success",
    fail_url: "https://banglabnb.com/payment-fail",
    cancel_url: "https://banglabnb.com/payment-cancel",
    ipn_url: "https://banglabnb-api.onrender.com/api/payment/ipn",
    cus_name: customer.name,
    cus_email: customer.email,
    cus_add1: customer.address,
    cus_phone: customer.phone,
    shipping_method: "NO",
    product_name: "BanglaBnB Booking",
    product_category: "Reservation",
    product_profile: "general",
  };

  try {
    const response = await axios.post(process.env.SSLCOMMERZ_API_URL, data);
    res.json({ url: response.data.GatewayPageURL });
  } catch (err) {
    console.error("SSLCOMMERZ ERROR:", err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

router.post("/success", async (req, res) => {
  const { tran_id, val_id, amount } = req.body;

  try {
    const booking = await Booking.findOne({ transactionId: tran_id });

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    booking.paymentStatus = "paid";
    booking.valId = val_id;
    booking.paidAmount = amount;
    booking.paidAt = new Date();
    booking.status = "confirmed"; // Optional
    await booking.save();

    res.redirect("https://banglabnb.com/payment-success");
  } catch (err) {
    console.error("Payment success error:", err);
    res.status(500).send("Server error");
  }
});
router.post("/fail", (req, res) => {
  res.redirect("https://banglabnb.com/payment-fail");
});

router.post("/cancel", (req, res) => {
  res.redirect("https://banglabnb.com/payment-cancel");
});

router.post("/ipn", async (req, res) => {
  const { tran_id, status } = req.body;

  if (status === "VALID") {
    await Booking.findOneAndUpdate(
      { transactionId: tran_id },
      {
        paymentStatus: "paid",
        status: "confirmed",
      }
    );
  }
  res.status(200).send("IPN received");
});

module.exports = router;
