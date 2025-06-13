const sendEmail = require("../utils/sendEmail");
const Payout = require("../models/Payout");
const sslcommerz = require("../utils/sslcommerz");

const scheduleHostPayout = async (booking) => {
  const host = booking.listingId.hostId;

  const payout = await Payout.create({
    bookingId: booking._id,
    hostId: host._id,
    amount: booking.paidAmount,
    status: "pending",
    scheduledAt: new Date(),
  });

  // 💳 Auto-transfer to host using SSLCOMMERZ Disbursement API (pseudo-code)
  try {
    const transferRes = await sslcommerz.disbursePayment({
      amount: booking.paidAmount,
      recipient_name: host.name,
      recipient_phone: host.phone,
      reference: `booking-${booking._id}`,
    });

    if (transferRes.status === "SUCCESS") {
      payout.status = "paid";
      payout.date = new Date();
      await payout.save();
    }
  } catch (err) {
    console.error("❌ SSLCOMMERZ payout failed:", err.message);
  }

  // ✉️ Send email
  await sendEmail({
    to: host.email,
    subject: "Your payout has been scheduled",
    html: `
      <p>Hello ${host.name},</p>
      <p>Your payout for Booking <strong>${booking._id}</strong> has been scheduled.</p>
      <p><strong>Amount:</strong> ${booking.paidAmount} BDT</p>
      <p>It will be processed within 24–48 hours.</p>
    `,
  });

  console.log("✅ Email sent to host for payout schedule");
};

module.exports = scheduleHostPayout;
