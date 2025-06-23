// routes/banner.js
const express = require("express");
const router = express.Router();
const {
  getBanners,
  addBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");

router.get("/", getBanners);
router.post("/", protect, authorize("admin"), addBanner);
router.delete("/:id", protect, authorize("admin"), deleteBanner);

module.exports = router;
