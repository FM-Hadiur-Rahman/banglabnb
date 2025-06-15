// === controllers/rideController.js ===
const RideBooking = require("../models/RideBooking");
const Trip = require("../models/Trip");

exports.bookRide = async (req, res) => {
  const { tripId, seats } = req.body;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip || trip.seatsAvailable < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalFare = trip.farePerSeat * seats;
    const ride = await RideBooking.create({
      tripId,
      userId: req.user._id,
      seats,
      totalFare,
    });

    trip.bookedSeats += seats;
    trip.seatsAvailable -= seats;
    if (trip.seatsAvailable === 0) trip.status = "booked";
    await trip.save();

    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
