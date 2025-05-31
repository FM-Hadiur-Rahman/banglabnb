const express = require("express");
const router = express.Router();
const {
  createReview,
  getListingReviews,
  respondToReview,
} = require("../controllers/reviewController");
const protect = require("../middleware/protect");

router.post("/", protect, createReview);
router.get("/listing/:listingId", getListingReviews); // ⚠️ Make sure /listing/:listingId
router.patch("/respond/:reviewId", protect, respondToReview); // Consistent with controller

module.exports = router;
