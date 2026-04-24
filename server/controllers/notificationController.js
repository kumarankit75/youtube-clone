const Notification = require("../models/Notification");

// Get all notifications for current user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiverId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark all notifications as read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { receiverId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark single notification as read
const markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      receiverId: req.user.id,
      read: false,
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotifications,
  markAllRead,
  markRead,
  getUnreadCount,
  deleteNotification,
};