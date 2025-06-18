// === controllers/tripController.js ===
const Trip = require("../models/Trip");

// controllers/tripController.js
exports.createTrip = async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      driverId: req.user._id,
      seatsAvailable: Number(req.body.seatsAvailable),
      farePerSeat: Number(req.body.farePerSeat),
    };
    // ✅ Parse location from JSON string
    if (req.body.location) {
      try {
        tripData.location = JSON.parse(req.body.location); // Must be GeoJSON: { type: "Point", coordinates: [lng, lat], address: "..." }
      } catch (error) {
        console.warn("⚠️ Invalid location JSON:", req.body.location);
        return res.status(400).json({ message: "Invalid location format" });
      }
    }

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
// controllers/tripController.js

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "driverId",
      "name phone avatar"
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (err) {
    console.error("❌ Error fetching trip by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.reserveSeat = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.seatsAvailable < 1) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Check if already reserved
    if (trip.passengers.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You have already reserved a seat" });
    }

    // Reserve seat
    trip.passengers.push(req.user._id);
    trip.seatsAvailable -= 1;
    await trip.save();

    res.status(200).json({ message: "Seat reserved", trip });
  } catch (err) {
    console.error("❌ Reserve seat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
