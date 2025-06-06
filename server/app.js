// server/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

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

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
