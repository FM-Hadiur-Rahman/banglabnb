require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");
const sendEmail = require("../utils/sendEmail"); // for notifications
const IPNLog = require("../models/IPNLog");
const qs = require("querystring");
const generateInvoice = require("../utils/generateInvoice");
const path = require("path");
const Notification = require("../models/Notification");
const fs = require("fs");

router.post("/initiate", async (req, res) => {
  const { amount, bookingId, customer } = req.body;

  const tran_id = `BNB_${bookingId}_${Date.now()}`;

  await Booking.findByIdAndUpdate(bookingId, {
    transactionId: tran_id,
    paymentStatus: "unpaid",
  });

  const data = {
    store_id: process.env.SSLCOMMERZ_STORE_ID || "bangl683f39645be2d",
    store_passwd: process.env.SSLCOMMERZ_STORE_PASS,
    total_amount: amount,
    currency: "BDT",
    tran_id,
    success_url: "https://banglabnb-api.onrender.com/api/payment/success", // ✅ point to backend
    fail_url: "https://banglabnb.com/payment-fail",
    cancel_url: "https://banglabnb.com/payment-cancel",
    ipn_url: "https://banglabnb-api.onrender.com/api/payment/ipn",

    cus_name: customer.name,
    cus_email: customer.email,
    cus_add1: customer.address || "Dhaka",
    cus_city: "Dhaka",
    cus_postcode: "1200",
    cus_country: "Bangladesh",
    cus_phone: customer.phone || "01763558585",

    shipping_method: "NO",
    product_name: "BanglaBnB Booking",
    product_category: "Reservation",
    product_profile: "general",
  };

  try {
    const response = await axios.post(
      process.env.SSLCOMMERZ_API_URL,
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.data.GatewayPageURL) {
      console.error("❌ Missing GatewayPageURL. Full response:");
      console.error(response.data);
      return res.status(400).json({ error: "Payment gateway URL missing" });
    }

    res.json({ url: response.data.GatewayPageURL });
  } catch (err) {
    console.error(
      "❌ SSLCOMMERZ AXIOS ERROR:",
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// ✅ SSLCOMMERZ will POST here after payment success
// 1️⃣ POST: SSLCOMMERZ redirects here after successful payment
router.post("/success", async (req, res) => {
  const { tran_id, val_id, amount } = req.body;

  try {
    const booking = await Booking.findOne({ transactionId: tran_id })
      .populate("guestId")
      .populate("listingId");
    if (!booking) return res.status(404).send("Booking not found");

    booking.paymentStatus = "paid";
    booking.valId = val_id;
    booking.paidAmount = amount;
    booking.paidAt = new Date();
    booking.status = "confirmed";
    await booking.save();

    const guest = booking.guestId;
    const listing = booking.listingId;
    const from = new Date(booking.dateFrom).toLocaleDateString();
    const to = new Date(booking.dateTo).toLocaleDateString();

    // 🧾 Generate Invoice (returns local path)
    const invoicePath = await generateInvoice(booking, listing, guest);

    // 📧 Guest email with invoice attached
    await sendEmail({
      to: guest.email,
      subject: "📄 Your BanglaBnB Invoice is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #1a202c; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px;">
          <h2 style="color: #10b981; text-align: center;">🧾 BanglaBnB Booking Invoice</h2>
          <p>Dear <strong>${guest.name}</strong>,</p>
          <p>Thank you for your booking with <strong>BanglaBnB</strong>! Your payment has been successfully processed.</p>
          <hr style="margin: 20px 0;" />
          <h3>🛏️ Listing Details</h3>
          <p><strong>${listing.title}</strong></p>
          <p>📍 ${listing.location?.address}</p>
          <p>📅 <strong>${from} → ${to}</strong></p>
          <h3>💵 Payment Summary</h3>
          <p>Total Paid: <strong>৳${booking.paidAmount}</strong></p>
          <p>Status: ✅ Paid</p>
          <p style="font-size: 14px; color: #4a5568;">আপনার বুকিং ইনভয়েস তৈরি হয়েছে। এটি মেইলে সংযুক্ত রয়েছে।</p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${booking._id}.pdf`,
          path: invoicePath,
          contentType: "application/pdf",
        },
      ],
    });

    // 📧 Host email with same attachment
    if (listing.hostId?.email) {
      await sendEmail({
        to: listing.hostId.email,
        subject: "📢 New Paid Booking on Your Listing!",
        html: `
        <div style="font-family: Arial, sans-serif; color: #1a202c; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px;">
          <h2 style="color: #2563eb; text-align: center;">📢 New Booking Received!</h2>
          <p>Dear <strong>${listing.hostId.name}</strong>,</p>
          <p>🎉 A guest has paid and confirmed a booking on your listing <strong>${listing.title}</strong>.</p>
          <p>📍 ${listing.location?.address}</p>
          <p>📅 ${from} → ${to}</p>
          <p>👤 ${guest.name} (${guest.email})</p>
          <p>💵 ৳${booking.paidAmount} — Paid</p>
          <p style="font-size: 14px; color: #4a5568;">ইনভয়েস মেইলের সাথে সংযুক্ত রয়েছে।</p>
        </div>
      `,
        attachments: [
          {
            filename: `invoice-${booking._id}.pdf`,
            path: invoicePath,
            contentType: "application/pdf",
          },
        ],
      });
    }

    // 🔔 In-app Notification
    await Notification.create({
      userId: guest._id,
      message: `🎉 Payment received for booking at ${listing.title}`,
      type: "payment",
    });
    // 🧹 Clean up local invoice file
    fs.unlink(invoicePath, (err) => {
      if (err) console.warn("⚠️ Could not delete invoice:", err);
    });

    //for chat between host and guest
    await axios.post(
      `${process.env.VITE_API_URL}/api/chats`,
      {
        bookingId: booking._id,
        listingId: listing._id,
        hostId: listing.ownerId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ Redirect
    res.redirect("https://banglabnb.com/payment-success?status=paid");
  } catch (err) {
    console.error("❌ Payment success error:", err);
    res.status(500).send("Server error");
  }
});

router.post("/fail", (req, res) => {
  res.redirect("https://banglabnb.com/payment-fail");
});

router.post("/cancel", (req, res) => {
  res.redirect("https://banglabnb.com/payment-cancel");
});

// ✅ IPN: server-to-server validation from SSLCOMMERZ
router.post("/ipn", async (req, res) => {
  await IPNLog.create({ payload: req.body });
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
