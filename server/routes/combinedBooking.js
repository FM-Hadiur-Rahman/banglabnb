const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const combinedBookingCtrl = require("../controllers/combinedBookingController");

router.post("/", protect, combinedBookingCtrl.createCombinedBooking);

module.exports = router;
