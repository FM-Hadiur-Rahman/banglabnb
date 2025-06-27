// scripts/markExistingListingsNotDeleted.js

const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const connectDB = require("../config/db.js");
require("dotenv").config();

(async () => {
  try {
    await connectDB(); // ✅ moved inside async IIFE

    const result = await Listing.updateMany(
      { isDeleted: { $exists: false } },
      { $set: { isDeleted: false, deletedAt: null } }
    );

    console.log(`✅ Listings updated: ${result.modifiedCount}`);
    process.exit();
  } catch (err) {
    console.error("❌ Error updating listings:", err);
    process.exit(1);
  }
})();
