const Comment = require("../models/Comment");
const User = require("../models/User");

// Add comment
const addComment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newComment = new Comment({
      videoId: req.params.videoId,
      userId: req.user.id,
      username: user.username,
      avatar: user.avatar,
      content: req.body.content,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get comments for a video
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addComment, getComments, deleteComment };