const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getNotifications,
  markAllRead,
  markRead,
  getUnreadCount,
  deleteNotification,
} = require("../controllers/notificationController");

router.get("/", verifyToken, getNotifications);
router.get("/unread-count", verifyToken, getUnreadCount);
router.put("/mark-all-read", verifyToken, markAllRead);
router.put("/:id/read", verifyToken, markRead);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;