// scripts/fixNotificationLinks.js

const connectDB = require("../config/db");
const Notification = require("../models/Notification");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing"); // 👈 ADD THIS LINE

(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected. Running fix...");

    const notifications = await Notification.find({
      type: "modification-request",
      link: { $regex: "^/host/listings/" }, // target broken links
    });

    console.log(`🔎 Found ${notifications.length} notifications to re-fix.`);

    for (const note of notifications) {
      const booking = await Booking.findOne({
        "modificationRequest.status": "requested",
      })
        .sort({ updatedAt: -1 })
        .populate("listingId"); // 🧠 This requires Listing model to be registered

      if (!booking || !booking.listingId) continue;

      note.link = `/host/listings/${booking.listingId._id}/bookings`;
      await note.save();

      console.log(`✅ Fixed notification ${note._id} → ${note.link}`);
    }

    console.log("🎉 All done.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Script failed:", err);
    process.exit(1);
  }
})();
