const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

exports.getAllListings = async (req, res) => {
  try {
    const { location, from, to, guests, type, minPrice, maxPrice } = req.query;
    const query = {};

    // Flexible filters
    if (location) {
      query["location.address"] = { $regex: location, $options: "i" };
    }

    if (type) {
      query.type = type; // e.g., 'hotel', 'resort'
    }

    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let listings = await Listing.find(query);

    // Date-based availability filter
    if (from && to) {
      const Booking = require("../models/Booking");
      const dateFrom = new Date(from);
      const dateTo = new Date(to);

      const bookedIds = await Booking.find({
        $or: [
          {
            dateFrom: { $lte: dateTo },
            dateTo: { $gte: dateFrom },
          },
        ],
      }).distinct("listingId");

      listings = listings.filter((l) => !bookedIds.includes(l._id.toString()));
    }

    res.json(listings);
  } catch (err) {
    console.error("❌ Error filtering listings:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// GET single listing
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({
      ...listing.toObject(),
      blockedDates: listing.blockedDates || [],
    });
  } catch (err) {
    console.error("❌ Error in getListingById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET listings by host
exports.getListingsByHost = async (req, res) => {
  const listings = await Listing.find({ hostId: req.params.hostId });
  res.json(listings);
};

// POST new listing
// exports.createListing = async (req, res) => {
//   const newListing = await Listing.create(req.body);
//   res.status(201).json(newListing);
// };

exports.createListing = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    let location;
    try {
      location =
        typeof req.body.location === "string"
          ? JSON.parse(req.body.location)
          : req.body.location;
    } catch (err) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const imageUrls = req.files.map((file) => file.path);

    const newListing = await Listing.create({
      title: req.body.title,
      price: req.body.price,
      maxGuests: req.body.maxGuests,
      division: req.body.division,
      district: req.body.district,
      location,
      images: imageUrls,
      hostId: req.user._id,
      roomType: req.body.roomType,
      description: req.body.description || "",
      houseRules: req.body.houseRules || "",
    });

    res.status(201).json(newListing);
  } catch (err) {
    console.error("❌ Listing creation failed:", err);
    res
      .status(500)
      .json({ message: "Listing creation failed", error: err.message });
  }
};

// PUT update listing
exports.updateListing = async (req, res) => {
  const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// DELETE listing

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // ✅ Optional: only allow deleting own listing
    if (listing.hostId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne(); // ✅ safer than .remove()
    res.json({ message: "Listing deleted" });
  } catch (err) {
    console.error("❌ DELETE error:", err);
    res.status(500).json({ message: "Server error while deleting listing." });
  }
};
// controllers/listingController.js

exports.blockDates = async (req, res) => {
  const { from, to } = req.body;
  const listing = await Listing.findById(req.params.id);

  if (!listing || listing.hostId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  listing.blockedDates.push({ from, to });
  await listing.save();
  res.json({ message: "Dates blocked", blockedDates: listing.blockedDates });
};

exports.unblockDates = async (req, res) => {
  const { from, to } = req.body;
  const listing = await Listing.findById(req.params.id);

  if (!listing || listing.hostId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  listing.blockedDates = listing.blockedDates.filter(
    (range) =>
      !(
        new Date(range.from).getTime() === new Date(from).getTime() &&
        new Date(range.to).getTime() === new Date(to).getTime()
      )
  );

  await listing.save();
  res.json({
    message: "Blocked dates removed",
    blockedDates: listing.blockedDates,
  });
};
