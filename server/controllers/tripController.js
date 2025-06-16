// === controllers/tripController.js ===
const Trip = require("../models/Trip");

// controllers/tripController.js
exports.createTrip = async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      driverId: req.user._id,
    };

    // ✅ If image was uploaded, store URL
    if (req.file && req.file.path) {
      tripData.image = req.file.path;
    }

    const trip = await Trip.create(tripData);
    res.status(201).json(trip);
  } catch (err) {
    console.error("❌ Trip creation failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ status: "available" });
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
