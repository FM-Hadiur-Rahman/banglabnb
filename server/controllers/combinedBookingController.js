exports.createCombinedBooking = async (req, res) => {
  const { listingId, dateFrom, dateTo, guests, selectedTripId } = req.body;

  try {
    // ❗ Get the listing first (after destructuring)
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // 1. Create Stay Booking
    const booking = new Booking({
      listingId,
      guestId: req.user._id,
      dateFrom,
      dateTo,
      guests,
      price: 0,
      paymentStatus: "pending",
      status: "pending",
      combined: !!selectedTripId,
      tripId: selectedTripId || null,
    });
    await booking.save();

    let trip = null;
    let tripFare = 0;

    // 2. Optional: Trip Reservation
    if (selectedTripId) {
      trip = await Trip.findById(selectedTripId);
      if (!trip) return res.status(404).json({ message: "Trip not found" });

      const reservedSeats = trip.passengers.reduce(
        (sum, p) => sum + (p.status !== "cancelled" ? p.seats : 0),
        0
      );
      const seatsAvailable = trip.totalSeats - reservedSeats;
      if (seatsAvailable < guests)
        return res.status(400).json({ message: "Not enough seats" });

      // Add guest to trip
      trip.passengers.push({
        user: req.user._id,
        bookingId: booking._id,
        seats: guests,
        status: "reserved",
      });
      await trip.save();

      tripFare = trip.farePerSeat * guests;
    }

    // 3. Calculate amount
    const nights =
      (new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24);
    const staySubtotal = nights * listing.price;
    const serviceFee = Math.round(staySubtotal * 0.15);
    const tax = Math.round(staySubtotal * 0.1);
    const totalAmount = staySubtotal + serviceFee + tax + tripFare;

    // 4. Return data for payment initiation
    res.json({
      bookingId: booking._id,
      tripId: selectedTripId || null,
      amount: totalAmount,
      breakdown: {
        staySubtotal,
        serviceFee,
        tax,
        tripFare,
      },
    });
  } catch (err) {
    console.error("❌ Combined booking error", err);
    res.status(500).json({ message: "Server error" });
  }
};
