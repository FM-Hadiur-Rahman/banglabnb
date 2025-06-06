const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const protect = require("../middleware/protect");

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post("/", protect, async (req, res) => {
  const { chatId, text } = req.body;

  try {
    const message = await Message.create({
      chatId,
      senderId: req.user._id,
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/messages/:chatId
// @desc    Get all messages from a specific chat
// @access  Private
router.get("/:chatId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
