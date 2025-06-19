const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  initiateCombinedPayment,
  combinedPaymentSuccess,
} = require("../controllers/combinedPaymentController");

router.post("/initiate", protect, initiateCombinedPayment);
router.post("/success", combinedPaymentSuccess); // SSLCOMMERZ calls this

module.exports = router;
