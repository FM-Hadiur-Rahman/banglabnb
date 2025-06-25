const express = require("express");
const router = express.Router();
const PromoCode = require("../models/PromoCode");

// Get all
router.post("/validate", async (req, res) => {
  const { code, total, type } = req.body;

  const promo = await PromoCode.findOne({
    code: code.toUpperCase(),
    active: true,
  });

  if (!promo) {
    return res.status(400).json({ message: "❌ Invalid promo code" });
  }

  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return res.status(400).json({ message: "❌ Promo expired" });
  }

  if (promo.for !== "all" && promo.for !== type) {
    return res
      .status(400)
      .json({ message: "❌ Not valid for this booking type" });
  }

  if (promo.minAmount && total < promo.minAmount) {
    return res.status(400).json({
      message: `Minimum ৳${promo.minAmount} required to apply this code`,
    });
  }

  let discountAmount =
    promo.type === "flat"
      ? promo.discount
      : Math.round((promo.discount / 100) * total);

  if (promo.maxDiscount)
    discountAmount = Math.min(discountAmount, promo.maxDiscount);

  res.json({ discount: discountAmount, promoId: promo._id });
});

module.exports = router;
