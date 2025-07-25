// migrateUsers.js
const mongoose = require("mongoose");
const connectDB = require("../config/db.js");
require("dotenv").config();
const User = require("../models/User"); // adjust this path

async function migrateRoles() {
  await connectDB(); // ✅ moved inside async IIFE
  console.log("🟢 Connected to MongoDB");

  const result = await User.updateMany(
    { role: { $exists: true }, roles: { $exists: false } },
    [
      {
        $set: {
          primaryRole: "$role",
          roles: ["$role"],
        },
      },
      { $unset: "role" },
    ]
  );

  console.log(`✅ Migrated ${result.modifiedCount} users`);
  await mongoose.disconnect();
  console.log("🔴 Disconnected");
}

migrateRoles().catch((err) => {
  console.error("❌ Migration failed:", err);
  mongoose.disconnect();
});
