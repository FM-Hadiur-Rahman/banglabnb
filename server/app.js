// server/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

const logRoute = require("./routes/log");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listing");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin"); // ✅ Admin routes
const reviewRoutes = require("./routes/reviewRoutes"); // 👈 Add this
const statsRoutes = require("./routes/stats");
const userRoutes = require("./routes/userRoutes.js");
const paymentRoutes = require("./routes/payment");
const notificationRoutes = require("./routes/notificationRoutes");
const invoiceRoutes = require("./routes/invoice");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const tripRoutes = require("./routes/tripRoutes");
const tripPaymentRoutes = require("./routes/tripPayment");
const bannerRoutes = require("./routes/banner");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from localhost and production
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://banglabnb.com",
      "http://localhost:8081", // Expo web
      "exp://192.168.0.112:8081", // optional: Expo Go app if needed
    ],

    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true })); // ✅ For form-encoded data
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("BanglaBnB API is running");
});

// ✅ Mount routes
app.use("/api/logs", logRoute);

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes); // 👈 mount it like other routes
app.use("/api/reviews", reviewRoutes); // 👈 Mount here
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/chats", chatRoutes); // All chat endpoints: /api/chats
app.use("/api/messages", messageRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trip-payment", tripPaymentRoutes);
app.use("/api/combined-bookings", require("./routes/combinedBooking"));
app.use("/api/combined-payment", require("./routes/combinedPayment"));
app.use("/api/banners", bannerRoutes);
app.use("/api/upload", require("./routes/upload"));

app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://banglabnb.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(500).json({ message: "Internal Server Error" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
