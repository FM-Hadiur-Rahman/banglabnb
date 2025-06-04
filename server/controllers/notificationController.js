// controllers/notificationController.js
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
