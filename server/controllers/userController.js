const User = require("../models/User");
const Video = require("../models/Video");
const Notification = require("../models/Notification");

const subscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { subscribedUsers: req.params.channelId },
    });
    await User.findByIdAndUpdate(req.params.channelId, {
      $inc: { subscribers: 1 },
    });

    // Notify channel owner
    const subscriber = await User.findById(req.user.id);
    await Notification.create({
      receiverId: req.params.channelId,
      senderId: req.user.id,
      senderName: subscriber.username,
      senderAvatar: subscriber.avatar || "",
      type: "subscribe",
      message: `${subscriber.username} subscribed to your channel`,
      videoId: null,
      videoTitle: null,
    });

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.channelId },
    });
    await User.findByIdAndUpdate(req.params.channelId, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getChannel = async (req, res) => {
  try {
    const user = await User.findById(req.params.channelId).select("-password");
    if (!user) return res.status(404).json({ message: "Channel not found" });
    const videoCount = await Video.countDocuments({ userId: req.params.channelId });
    res.status(200).json({ ...user._doc, videoCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (username) {
      const existing = await User.findOne({ username });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    let avatarUrl = undefined;
    if (req.file) {
      avatarUrl = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(username && { username }),
          ...(email && { email }),
          ...(avatarUrl && { avatar: avatarUrl }),
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { subscribe, unsubscribe, getChannel, updateProfile };