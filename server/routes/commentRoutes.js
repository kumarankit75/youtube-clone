const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");

router.post("/:videoId", verifyToken, addComment);
router.get("/:videoId", getComments);
router.delete("/:commentId", verifyToken, deleteComment);

module.exports = router;