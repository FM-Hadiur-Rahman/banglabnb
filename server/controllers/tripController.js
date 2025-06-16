// === controllers/tripController.js ===
const Trip = require("../models/Trip");

exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, driverId: req.user._id });
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
