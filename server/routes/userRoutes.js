const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  updateCurrentUser,
  getCurrentUser,
  updatePaymentDetails,
  getPaymentDetails,
} = require("../controllers/userController");

router.patch("/me", protect, updateCurrentUser);
router.get("/me", protect, getCurrentUser);
router.get("/payment-details", protect, getPaymentDetails);
router.put("/payment-details", protect, updatePaymentDetails);
module.exports = router;
