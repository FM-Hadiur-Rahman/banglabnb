const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

exports.getAllListings = async (req, res) => {
  try {
    const {
      location,
      from,
      to,
      guests,
      type,
      minPrice,
      maxPrice,
      keyword,
      tags,
      sortBy = "createdAt",
      order = "desc",
      lat,
      lng,
      radius = 50, // default 50km
      page = 1,
      limit = 12,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pipeline = [];

    // 🔍 Log raw request params for debugging
    console.log("🔍 Incoming search filters:", req.query);
    console.log("✅ Final pipeline:", JSON.stringify(pipeline, null, 2));

    // ✅ 1. Geo search with radius (if lat/lng provided)
    const useGeo =
      lat && lng && !isNaN(lat) && !isNaN(lng) && parseFloat(radius) > 0;

    if (useGeo) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: parseFloat(radius) * 1000, // convert km to meters
        },
      });
    }

    // ✅ 2. Base match filter
    const match = { isDeleted: false };

    if (location) {
      match["location.address"] = { $regex: location, $options: "i" };
    }

    if (type) match.type = type;
    if (req.query.guests && !isNaN(req.query.guests)) {
      const guestInt = parseInt(req.query.guests);
      if (guestInt > 1) {
        match.maxGuests = { $gte: guestInt };
      }
    }

    if (minPrice || maxPrice) {
      match.price = {};
      if (minPrice) match.price.$gte = parseFloat(minPrice);
      if (maxPrice) match.price.$lte = parseFloat(maxPrice);
    }

    pipeline.push({ $match: match });

    // ✅ 3. Keyword search
    if (keyword) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        },
      });
    }

    // ✅ 4. Tags filter
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      pipeline.push({
        $match: {
          tags: { $in: tagArray },
        },
      });
    }

    // ✅ Add this after other $match stages (e.g., after tags filter)
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "hostId",
        foreignField: "_id",
        as: "host",
        pipeline: [{ $project: { name: 1, avatar: 1, premium: 1 } }],
      },
    });
    pipeline.push({ $unwind: "$host" });

    // ✅ 5. Date-based booking exclusion
    if (from && to) {
      const dateFrom = new Date(from);
      const dateTo = new Date(to);

      const bookedIds = await Booking.find({
        $or: [{ dateFrom: { $lte: dateTo }, dateTo: { $gte: dateFrom } }],
      }).distinct("listingId");

      if (bookedIds.length > 0) {
        pipeline.push({
          $match: {
            _id: {
              $nin: bookedIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        });
      }
    }

    // ✅ 6. Sorting logic
    const sortField =
      sortBy === "priceAsc"
        ? { price: 1 }
        : sortBy === "priceDesc"
        ? { price: -1 }
        : { [sortBy]: order === "asc" ? 1 : -1 };

    pipeline.push({ $sort: sortField });

    // ✅ 7. Count listings before pagination
    const countPipeline = [...pipeline, { $count: "totalCount" }];
    const countResult = await Listing.aggregate(countPipeline);
    const totalCount = countResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // ✅ 8. Paginate and fetch
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    const listings = await Listing.aggregate(pipeline);

    console.log(
      `✅ ${listings.length} listings returned (page ${page} of ${totalPages})`
    );

    res.json({
      listings,
      totalCount,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("❌ Error in getAllListings:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// GET single listing
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("hostId", "name avatar premium");

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
  const listings = await Listing.find({
    hostId: req.params.hostId,
    isDeleted: false,
  });

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

    // 🔄 Soft delete instead of hard delete
    listing.isDeleted = true;
    listing.deletedAt = new Date();
    await listing.save();

    res.json({ message: "Listing soft-deleted" });
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
