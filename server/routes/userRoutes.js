// const express = require("express");
// const router = express.Router();
// const verifyToken = require("../middleware/verifyToken");
// const { subscribe, unsubscribe, getChannel } = require("../controllers/userController");

// router.put("/subscribe/:channelId", verifyToken, subscribe);
// router.put("/unsubscribe/:channelId", verifyToken, unsubscribe);
// router.get("/channel/:channelId", getChannel);

// module.exports = router;



const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const verifyToken = require("../middleware/verifyToken");
const { subscribe, unsubscribe, getChannel, updateProfile } = require("../controllers/userController");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "youtube-clone/avatars",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

router.put("/subscribe/:channelId", verifyToken, subscribe);
router.put("/unsubscribe/:channelId", verifyToken, unsubscribe);
router.get("/channel/:channelId", getChannel);
router.put("/update", verifyToken, uploadAvatar.single("avatar"), updateProfile);

module.exports = router;