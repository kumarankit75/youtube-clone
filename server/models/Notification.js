const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  // Who receives the notification
  receiverId: {
    type: String,
    required: true,
  },
  // Who triggered the notification
  senderId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderAvatar: {
    type: String,
    default: "",
  },
  // Type: "upload" | "like" | "comment" | "subscribe"
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    default: null,
  },
  videoTitle: {
    type: String,
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);