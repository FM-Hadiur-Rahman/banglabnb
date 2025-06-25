const mongoose = require("mongoose");
const connectDB = require("../config/db.js");
const User = require("../models/User"); // adjust path as needed
require("dotenv").config();

async function assignReferralCodes() {
  await connectDB();

  const users = await User.find({ referralCode: { $exists: false } });

  console.log(`Found ${users.length} users without referral codes.`);

  for (const user of users) {
    const prefix = user.name?.split(" ")[0]?.toUpperCase() || "USER";
    const suffix = Math.floor(1000 + Math.random() * 9000);
    user.referralCode = `${prefix}-${suffix}`;
    await user.save();
    console.log(`✅ Assigned ${user.referralCode} to ${user.email}`);
  }

  console.log("🎉 All missing referral codes assigned!");
  process.exit();
}

assignReferralCodes().catch((err) => {
  console.error("❌ Error assigning referral codes:", err);
  process.exit(1);
});
