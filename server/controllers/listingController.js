const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

// GET all listings
// exports.getAllListings = async (req, res) => {
//   const listings = await Listing.find();
//   res.json(listings);
// };

// GET all listings with optional filters
exports.getAllListings = async (req, res) => {
  try {
    const { location, from, to, guests } = req.query;
    const query = {};

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Guests filter
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    // Step 1: Base listings
    let listings = await Listing.find(query);

    // Step 2: Convert date strings to Date objects
    const dateFrom = from ? new Date(from) : null;
    const dateTo = to ? new Date(to) : null;

    // Step 3: Filter out overlapping bookings
    if (dateFrom && dateTo) {
      const Booking = require("../models/Booking");

      const bookedListings = await Booking.find({
        $or: [
          {
            dateFrom: { $lte: dateTo },
            dateTo: { $gte: dateFrom },
          },
        ],
      }).distinct("listingId");

      listings = listings.filter(
        (listing) => !bookedListings.includes(listing._id.toString())
      );
    }

    res.json(listings);
  } catch (err) {
    console.error("❌ Error filtering listings:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// GET single listing
exports.getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json(listing);
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
    const imageUrls = req.files.map((file) => file.path); // Cloudinary paths

    const newListing = await Listing.create({
      title: req.body.title,
      price: req.body.price,
      maxGuests: req.body.maxGuests,
      division: req.body.division,
      district: req.body.district,
      location: JSON.parse(req.body.location), // must be stringified in frontend
      images: imageUrls,
      hostId: req.user._id,
    });

    res.status(201).json(newListing);
  } catch (err) {
    console.error("❌ Listing creation failed:", err);
    res.status(500).json({ message: "Listing creation failed" });
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
