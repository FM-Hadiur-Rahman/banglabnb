// scripts/markExistingUsersNotDeleted.js

const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db.js");
require("dotenv").config();

(async () => {
  try {
    await connectDB(); // ✅ moved inside async IIFE

    const result = await User.updateMany(
      { isDeleted: { $exists: false } },
      { $set: { isDeleted: false, deletedAt: null } }
    );

    console.log(`✅ Users updated: ${result.modifiedCount}`);
    process.exit();
  } catch (err) {
    console.error("❌ Error updating users:", err);
    process.exit(1);
  }
})();
