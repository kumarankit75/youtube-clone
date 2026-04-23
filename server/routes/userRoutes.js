const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { subscribe, unsubscribe, getChannel } = require("../controllers/userController");

router.put("/subscribe/:channelId", verifyToken, subscribe);
router.put("/unsubscribe/:channelId", verifyToken, unsubscribe);
router.get("/channel/:channelId", getChannel);

module.exports = router;