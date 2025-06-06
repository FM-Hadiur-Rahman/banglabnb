const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const protect = require("../middleware/protect");

// @route   POST /api/chats
// @desc    Create a chat after successful booking/payment
// @access  Private
router.post("/", protect, async (req, res) => {
  const { bookingId, listingId, hostId } = req.body;
  const guestId = req.user._id;

  try {
    const existingChat = await Chat.findOne({ bookingId });
    if (existingChat) return res.json(existingChat);

    const chat = await Chat.create({
      bookingId,
      listingId,
      participants: [guestId, hostId],
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error("Chat creation failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/chats
// @desc    Get all chats for logged-in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    }).populate("participants", "name avatar email");

    res.json(chats);
  } catch (err) {
    console.error("Fetching chats failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
