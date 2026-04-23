// // const express = require("express");
// // const router = express.Router();
// // const verifyToken = require("../middleware/verifyToken");
// // const { uploadVideo: uploadMiddleware, uploadImage } = require("../config/cloudinary");
// // const multer = require("multer");
// // const {
// //   uploadVideo,
// //   getVideo,
// //   getAllVideos,
// //   getVideosByTag,
// //   searchVideos,
// // } = require("../controllers/videoController");

// // // Multer fields for video + thumbnail
// // const upload = multer().fields([]);
// // const { CloudinaryStorage } = require("multer-storage-cloudinary");
// // const cloudinary = require("cloudinary").v2;
// // const multerUpload = require("multer")({
// //   storage: new CloudinaryStorage({
// //     cloudinary,
// //     params: (req, file) => {
// //       if (file.fieldname === "video") {
// //         return { resource_type: "video", folder: "youtube-clone/videos" };
// //       }
// //       return { resource_type: "image", folder: "youtube-clone/thumbnails" };
// //     },
// //   }),
// // });

// // router.post("/", verifyToken, multerUpload.fields([
// //   { name: "video", maxCount: 1 },
// //   { name: "thumbnail", maxCount: 1 },
// // ]), uploadVideo);

// // router.get("/", getAllVideos);
// // router.get("/search", searchVideos);
// // router.get("/tags", getVideosByTag);
// // router.get("/:id", getVideo);

// // module.exports = router;








// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const verifyToken = require("../middleware/verifyToken");
// const {
//   uploadVideo,
//   getVideo,
//   getAllVideos,
//   getVideosByTag,
//   searchVideos,
// } = require("../controllers/videoController");

// // Configure cloudinary AFTER dotenv has loaded
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Verify cloudinary config loaded
// console.log("Cloudinary cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("Cloudinary API key:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: (req, file) => {
//     if (file.fieldname === "video") {
//       return {
//         resource_type: "video",
//         folder: "youtube-clone/videos",
//         allowed_formats: ["mp4", "mkv", "avi", "mov"],
//       };
//     } else {
//       return {
//         resource_type: "image",
//         folder: "youtube-clone/thumbnails",
//         allowed_formats: ["jpg", "jpeg", "png", "webp"],
//       };
//     }
//   },
// });

// const upload = multer({ storage });

// router.post("/", verifyToken, upload.fields([
//   { name: "video", maxCount: 1 },
//   { name: "thumbnail", maxCount: 1 },
// ]), uploadVideo);

// router.get("/", getAllVideos);
// router.get("/search", searchVideos);
// router.get("/tags", getVideosByTag);
// router.get("/:id", getVideo);

// module.exports = router;







const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const verifyToken = require("../middleware/verifyToken");
const {
  uploadVideo,
  getVideo,
  getAllVideos,
  getVideosByTag,
  searchVideos,
} = require("../controllers/videoController");

const { likeVideo, dislikeVideo } = require("../controllers/videoController");

const { getTrendingVideos } = require("../controllers/videoController");
const { getVideosByUser } = require("../controllers/videoController");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "video") {
      return {
        resource_type: "video",
        folder: "youtube-clone/videos",
        allowed_formats: ["mp4", "mkv", "avi", "mov"],
      };
    } else {
      return {
        resource_type: "image",
        folder: "youtube-clone/thumbnails",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }
  },
});

const upload = multer({ storage });

// ✅ Wrap multer in error handler
router.post("/", verifyToken, (req, res, next) => {
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary error:", err);
      console.error("Multer error message:", err.message);
      console.error("Multer error details:", JSON.stringify(err, null, 2));
      return res.status(500).json({ message: err.message || "File upload failed" });
    }
    next();
  });
}, uploadVideo);

router.get("/", getAllVideos);
router.get("/search", searchVideos);
router.get("/tags", getVideosByTag);
router.get("/trending", getTrendingVideos);
router.get("/user/:userId", getVideosByUser);

router.get("/:id", getVideo);

router.put("/like/:id", verifyToken, likeVideo);
router.put("/dislike/:id", verifyToken, dislikeVideo);

module.exports = router;




