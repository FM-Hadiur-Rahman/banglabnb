const Review = require("../models/Review");
const Booking = require("../models/Booking");

// ✅ Only allow review if guest has checked out
const createReview = async (req, res) => {
  const { bookingId, rating, text } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.guestId.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed to review" });

  if (new Date(booking.dateTo) > new Date())
    return res
      .status(400)
      .json({ message: "You can review only after checkout" });

  const review = await Review.create({
    bookingId,
    guestId: req.user.id,
    listingId: booking.listingId,
    rating,
    text,
  });

  res.status(201).json(review);
};

const getListingReviews = async (req, res) => {
  const reviews = await Review.find({ listingId: req.params.listingId })
    .populate("guestId", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
};

const respondToReview = async (req, res) => {
  const { reviewId } = req.params;
  const { response } = req.body;

  const review = await Review.findById(reviewId).populate("listingId");
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.listingId.hostId.toString() !== req.user.id)
    return res.status(403).json({ message: "Only host can respond" });

  review.response = response;
  await review.save();

  res.json(review);
};

// ✅ Export all
module.exports = {
  createReview,
  getListingReviews,
  respondToReview,
};
