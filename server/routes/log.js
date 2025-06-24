// routes/log.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { message, stack, context, user } = req.body;

  console.error("🪵 Client Log:", {
    message,
    stack,
    context,
    user,
    time: new Date().toISOString(),
  });

  // Optional: Save to DB or log file
  res.status(200).json({ message: "Log received" });
});

module.exports = router;
