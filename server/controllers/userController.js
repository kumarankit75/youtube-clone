const User = require("../models/User");
const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2;

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if username already taken by another user
    if (username) {
      const existing = await User.findOne({ username });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    let avatarUrl = undefined;

    // If new avatar uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "youtube-clone/avatars",
        resource_type: "image",
      });
      avatarUrl = result.secure_url;
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

// Subscribe to a channel
const subscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { subscribedUsers: req.params.channelId },
    });
    await User.findByIdAndUpdate(req.params.channelId, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unsubscribe from a channel
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

// Get channel info
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

module.exports = { subscribe, unsubscribe, getChannel, updateProfile };