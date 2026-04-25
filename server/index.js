const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const server = http.createServer(app); // 👈 wrap express with http

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://my-tubeclone.vercel.app",
    process.env.FRONTEND_URL,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors()); // Handle preflight requests

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("YouTube Clone API is running!");
});

// Socket.io live chat
const chatRooms = {}; // Store messages in memory per video

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a video chat room
  socket.on("joinRoom", ({ videoId, username, avatar }) => {
    socket.join(videoId);
    socket.data.username = username;
    socket.data.avatar = avatar;
    socket.data.videoId = videoId;

    // Send existing messages to new user
    if (chatRooms[videoId]) {
      socket.emit("chatHistory", chatRooms[videoId]);
    } else {
      chatRooms[videoId] = [];
    }

    // Notify others in room
    socket.to(videoId).emit("userJoined", {
      username,
      message: `${username} joined the chat`,
      type: "system",
      timestamp: new Date(),
    });
  });

  // Handle new chat message
  socket.on("sendMessage", ({ videoId, message, username, avatar }) => {
    const chatMessage = {
      id: Date.now(),
      username,
      avatar,
      message,
      timestamp: new Date(),
      type: "message",
    };

    // Store in memory (keep last 100 messages)
    if (!chatRooms[videoId]) chatRooms[videoId] = [];
    chatRooms[videoId].push(chatMessage);
    if (chatRooms[videoId].length > 100) {
      chatRooms[videoId].shift();
    }

    // Broadcast to all in room including sender
    io.to(videoId).emit("newMessage", chatMessage);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.data.videoId && socket.data.username) {
      socket.to(socket.data.videoId).emit("userLeft", {
        username: socket.data.username,
        message: `${socket.data.username} left the chat`,
        type: "system",
        timestamp: new Date(),
      });
    }
    console.log("User disconnected:", socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    server.listen(process.env.PORT || 5000, () => { // 👈 use server.listen not app.listen
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error(err));