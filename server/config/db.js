const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // ✅ Must be at the top

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
