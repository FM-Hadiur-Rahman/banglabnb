const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const protect = require("../middleware/protect");

// Create chat after payment
router.post("/", protect, async (req, res) => {
  const { bookingId, listingId, hostId } = req.body;
  const guestId = req.user._id;

  try {
    const existing = await Chat.findOne({ bookingId });
    if (existing) return res.json(existing);

    const chat = await Chat.create({
      bookingId,
      listingId,
      participants: [guestId, hostId],
    });

    res.status(201).json(chat);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating chat", error: err.message });
  }
});
