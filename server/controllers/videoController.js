const Video = require("../models/Video");
const User = require("../models/User");
const Notification = require("../models/Notification");

const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({ message: "Video and thumbnail are required" });
    }

    const newVideo = new Video({
      userId: req.user.id,
      title,
      description,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      videoUrl: req.files.video[0].path,
      thumbnailUrl: req.files.thumbnail[0].path,
    });

    await newVideo.save();

    // Notify all subscribers about new video
    const uploader = await User.findById(req.user.id);
    if (uploader.subscribedUsers && uploader.subscribedUsers.length > 0) {
      const notifications = uploader.subscribedUsers.map((subscriberId) => ({
        receiverId: subscriberId,
        senderId: req.user.id,
        senderName: uploader.username,
        senderAvatar: uploader.avatar || "",
        type: "upload",
        message: `${uploader.username} uploaded a new video: "${title}"`,
        videoId: newVideo._id,
        videoTitle: title,
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json(newVideo);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    await Video.findByIdAndUpdate(req.params.id, {
      $pull: { dislikes: req.user.id },
    });

    if (video.likes.includes(req.user.id)) {
      await Video.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user.id },
      });
      return res.status(200).json({ message: "Like removed" });
    } else {
      await Video.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user.id },
      });

      // Notify video owner
      if (video.userId !== req.user.id) {
        const liker = await User.findById(req.user.id);
        await Notification.create({
          receiverId: video.userId,
          senderId: req.user.id,
          senderName: liker.username,
          senderAvatar: liker.avatar || "",
          type: "like",
          message: `${liker.username} liked your video "${video.title}"`,
          videoId: video._id,
          videoTitle: video.title,
        });
      }

      return res.status(200).json({ message: "Video liked" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    await Video.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user.id },
    });

    if (video.dislikes.includes(req.user.id)) {
      await Video.findByIdAndUpdate(req.params.id, {
        $pull: { dislikes: req.user.id },
      });
      return res.status(200).json({ message: "Dislike removed" });
    } else {
      await Video.findByIdAndUpdate(req.params.id, {
        $push: { dislikes: req.user.id },
      });
      return res.status(200).json({ message: "Video disliked" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVideosByTag = async (req, res) => {
  try {
    const tags = req.query.tags.split(",");
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchVideos = async (req, res) => {
  try {
    const query = req.query.q;
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTrendingVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVideosByUser = async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadVideo,
  getVideo,
  getAllVideos,
  getVideosByTag,
  searchVideos,
  likeVideo,
  dislikeVideo,
  getTrendingVideos,
  getVideosByUser,
};