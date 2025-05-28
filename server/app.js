// server/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listing");
const bookingRoutes = require("./routes/booking");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from localhost and production
app.use(
  cors({
    origin: ["http://localhost:5173", "https://banglabnb.com"],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("BanglaBnB API is running");
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
