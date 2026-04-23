const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "video",
    folder: "youtube-clone/videos",
    allowed_formats: ["mp4", "mkv", "avi", "mov"],
  },
});

// Storage for thumbnails
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "image",
    folder: "youtube-clone/thumbnails",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadVideo = multer({ storage: videoStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { uploadVideo, uploadImage };