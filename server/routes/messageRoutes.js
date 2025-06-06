// Send message
router.post("/", protect, async (req, res) => {
  const { chatId, text } = req.body;
  const message = await Message.create({
    chatId,
    senderId: req.user._id,
    text,
  });
  res.status(201).json(message);
});

// Get messages
router.get("/:chatId", protect, async (req, res) => {
  const messages = await Message.find({ chatId: req.params.chatId }).sort(
    "createdAt"
  );
  res.json(messages);
});
