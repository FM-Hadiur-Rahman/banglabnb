const express = require("express");
const router = express.Router();
const axios = require("axios");
const protect = require("../middleware/protect");
const TripReservation = require("../models/TripReservation");
const Trip = require("../models/Trip");
const qs = require("querystring");
const sendEmail = require("../utils/sendEmail");
const generateTripInvoice = require("../utils/generateTripInvoice");
const User = require("../models/User");

require("dotenv").config();

// ✅ Trip Payment Initiation
router.post("/trip-initiate", protect, async (req, res) => {
  const { tripId, seats } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const totalFare = seats * trip.farePerSeat;
    const tran_id = `TRIP_${tripId}_${Date.now()}`;

    const reservation = await TripReservation.create({
      tripId,
      userId: req.user._id,
      transactionId: tran_id,
      numberOfSeats: seats,
      farePerSeat: trip.farePerSeat,
      totalAmount: totalFare,
    });

    const data = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASS,
      total_amount: totalFare,
      currency: "BDT",
      tran_id,
      success_url: `${process.env.CLIENT_URL}/trip-payment-success?tran_id=${tran_id}`,
      fail_url: `${process.env.CLIENT_URL}/trip-payment-fail`,
      cancel_url: `${process.env.CLIENT_URL}/trip-payment-cancel`,
      ipn_url: `${process.env.API_URL}/api/trip-payment/trip-success`,
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: req.user.address || "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1200",
      cus_country: "Bangladesh",
      cus_phone: req.user.phone || "01700000000",
      shipping_method: "NO",
      product_name: "BanglaBnB Trip Reservation",
      product_category: "Ride",
      product_profile: "general",
    };

    const response = await axios.post(
      process.env.SSLCOMMERZ_API_URL,
      qs.stringify(data),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!response.data.GatewayPageURL)
      return res.status(400).json({ error: "Payment gateway URL missing" });

    res.json({ url: response.data.GatewayPageURL });
  } catch (err) {
    console.error("Trip payment initiation failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Trip Payment Success
// ✅ Trip Payment Success
router.post("/trip-success", async (req, res) => {
  const { tran_id, val_id, amount } = req.body;

  try {
    const reservation = await TripReservation.findOne({
      transactionId: tran_id,
    });
    if (!reservation) return res.status(404).send("Reservation not found");

    reservation.status = "paid";
    reservation.valId = val_id;
    reservation.paidAt = new Date();
    await reservation.save();

    // ✅ Optional: Update passengers in Trip model
    await Trip.findByIdAndUpdate(reservation.tripId, {
      $push: {
        passengers: {
          user: reservation.passengerId,
          seats: reservation.seats,
          status: "reserved",
        },
      },
    });

    // ✅ Generate invoice and send email to rider
    const user = await User.findById(reservation.passengerId);
    const trip = await Trip.findById(reservation.tripId);
    const invoicePath = await generateTripInvoice(reservation, trip, user);

    await sendEmail({
      to: user.email,
      subject: "🧾 Your Trip Reservation Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; color: #1a202c; padding: 24px;">
          <h2 style="color: #2563eb;">✅ Your Trip is Confirmed!</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your seat(s) for the ride from <strong>${trip.from}</strong> to <strong>${trip.to}</strong> on ${trip.date} at ${trip.time} has been confirmed.</p>
          <p><strong>Seats:</strong> ${reservation.numberOfSeats}</p>
          <p><strong>Total Paid:</strong> ৳${reservation.totalAmount}</p>

          <p>Attached is your booking invoice. Thank you for using BanglaBnB!</p>
        </div>
      `,
      attachments: [
        {
          filename: `trip-invoice-${reservation._id}.pdf`,
          path: invoicePath,
          contentType: "application/pdf",
        },
      ],
    });
    // Also send invoice to driver
    const driver = await User.findById(trip.driverId);
    if (driver?.email) {
      await sendEmail({
        to: driver.email,
        subject: "📢 A New Passenger Has Reserved Your Trip",
        html: `
      <div style="font-family: Arial, sans-serif; color: #1a202c; padding: 24px;">
        <h2 style="color: #16a34a;">🚘 New Trip Reservation</h2>
        <p>Dear <strong>${driver.name}</strong>,</p>
        <p><strong>${user.name}</strong> has reserved <strong>${reservation.numberOfSeats}</strong> seat(s) for your trip...</p>

        <p>Trip Date: ${trip.date} at ${trip.time}</p>
        <p>Check attached invoice for full details.</p>
      </div>
    `,
        attachments: [
          {
            filename: `trip-invoice-${reservation._id}.pdf`,
            path: invoicePath,
            contentType: "application/pdf",
          },
        ],
      });
    }

    // ✅ Final redirect
    res.redirect(
      `${process.env.CLIENT_URL}/trip-payment-success?tran_id=${tran_id}`
    );
  } catch (err) {
    console.error("Trip payment success error:", err.message);
    res.status(500).send("Server error");
  }
});

// 🔐 Get Trip Reservation Status by Transaction ID
router.get("/reservation/:tran_id", protect, async (req, res) => {
  try {
    const reservation = await TripReservation.findOne({
      transactionId: req.params.tran_id,
      passengerId: req.user._id,
    })
      .populate("tripId")
      .populate("passengerId", "name email");

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    res.json(reservation);
  } catch (err) {
    console.error("❌ Failed to fetch reservation:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
