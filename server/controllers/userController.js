const User = require("../models/User");
const Video = require("../models/Video");
// Subscribe to a channel
const subscribe = async (req, res) => {
  try {
    // Add channel to current user's subscribed list
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { subscribedUsers: req.params.channelId },
    });
    // Increment channel's subscriber count
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
// const getChannel = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.channelId).select("-password");
//     if (!user) return res.status(404).json({ message: "Channel not found" });
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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



module.exports = { subscribe, unsubscribe, getChannel };