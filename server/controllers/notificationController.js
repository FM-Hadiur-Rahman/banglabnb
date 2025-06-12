const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id;
    const result = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });
    res.json({ unread: count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
