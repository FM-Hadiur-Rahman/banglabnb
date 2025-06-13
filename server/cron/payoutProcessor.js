const cron = require("node-cron");
const Booking = require("../models/Booking");
const scheduleHostPayout = require("../utils/scheduleHostPayout");

// Runs every hour
cron.schedule("0 * * * *", async () => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const eligibleBookings = await Booking.find({
    paymentStatus: "paid",
    checkInAt: { $lte: oneDayAgo },
    payoutIssued: { $ne: true },
  }).populate({
    path: "listingId",
    populate: { path: "hostId" },
  });

  for (let booking of eligibleBookings) {
    await scheduleHostPayout(booking); // ✅ Use the helper
    booking.payoutIssued = true;
    await booking.save();
  }

  console.log(`✅ Payouts scheduled for ${eligibleBookings.length} bookings`);
});
