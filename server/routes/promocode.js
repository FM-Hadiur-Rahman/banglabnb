const express = require("express");
const router = express.Router();
const Promocode = require("../models/Promocode");

router.post("/validate", async (req, res) => {
  const { code, type, totalAmount } = req.body;

  const promo = await Promocode.findOne({ code: code.toUpperCase() });
  if (!promo) return res.status(404).json({ message: "❌ Invalid promo code" });

  if (promo.expiresAt && promo.expiresAt < Date.now())
    return res.status(400).json({ message: "⚠️ Promo code expired" });

  if (promo.maxUses && promo.usedCount >= promo.maxUses)
    return res
      .status(400)
      .json({ message: "⚠️ Promo code usage limit reached" });

  if (promo.applicableTo !== "both" && promo.applicableTo !== type)
    return res
      .status(400)
      .json({ message: `⚠️ Not applicable to ${type} bookings` });

  if (totalAmount < promo.minBookingAmount)
    return res
      .status(400)
      .json({
        message: `Minimum booking amount is ৳${promo.minBookingAmount}`,
      });

  let discount = promo.amount;
  if (promo.discountType === "percent") {
    discount = Math.round((promo.amount / 100) * totalAmount);
  }

  return res.json({ success: true, discount, promoId: promo._id });
});

module.exports = router;
