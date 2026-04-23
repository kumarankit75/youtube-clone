const Video = require("../models/Video");

// Like a video
const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove from dislikes if exists
    await Video.findByIdAndUpdate(req.params.id, {
      $pull: { dislikes: req.user.id },
    });

    // Toggle like
    if (video.likes.includes(req.user.id)) {
      await Video.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user.id },
      });
      return res.status(200).json({ message: "Like removed" });
    } else {
      await Video.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user.id },
      });
      return res.status(200).json({ message: "Video liked" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dislike a video
const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove from likes if exists
    await Video.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user.id },
    });

    // Toggle dislike
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

// Keep all existing functions and add these exports
const uploadVideo = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);

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
    res.status(201).json(newVideo);
  } catch (err) {
    console.error("Upload error:", JSON.stringify(err, null, 2));
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

module.exports = {
  uploadVideo,
  getVideo,
  getAllVideos,
  getVideosByTag,
  searchVideos,
  likeVideo,
  dislikeVideo,
};