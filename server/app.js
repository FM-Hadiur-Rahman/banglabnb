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

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("BanglaBnB API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);

// 🧠 Connect DB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
