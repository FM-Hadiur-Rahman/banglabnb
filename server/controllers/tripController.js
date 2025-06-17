// === controllers/tripController.js ===
const Trip = require("../models/Trip");

// controllers/tripController.js
exports.createTrip = async (req, res) => {
  try {
    console.log("✅ File received:", req.file);
    console.log("✅ Body received:", req.body);
    console.log("👤 User ID:", req.user._id);

    const tripData = {
      ...req.body,
      driverId: req.user._id,
      seatsAvailable: Number(req.body.seatsAvailable),
      farePerSeat: Number(req.body.farePerSeat),
    };

    if (req.file && req.file.path) {
      tripData.image = req.file.path;
    }

    const trip = await Trip.create(tripData);
    res.status(201).json(trip);
  } catch (err) {
    console.error("❌ Trip creation failed:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ status: "available" }).populate("driverId");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get all trips for the logged-in driver
exports.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ driverId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(trips);
  } catch (err) {
    console.error("❌ Error fetching driver's trips:", err);
    res.status(500).json({ message: "Server error" });
  }
};
