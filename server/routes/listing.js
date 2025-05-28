const express = require("express");
const router = express.Router();
const listingCtrl = require("../controllers/listingController");
const protect = require("../middleware/protect");

const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

// Public Routes
router.get("/", listingCtrl.getAllListings);
router.get("/:id", listingCtrl.getListingById);
router.get("/host/:hostId", listingCtrl.getListingsByHost);

// ✅ Protected CRUD routes
router.post("/", protect, listingCtrl.createListing);
router.put("/:id", protect, listingCtrl.updateListing);
router.delete("/:id", protect, listingCtrl.deleteListing);

// ✅ Upload image to Cloudinary
router.post("/upload", upload.single("image"), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
