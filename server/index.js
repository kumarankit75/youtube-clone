// // // // // import express from "express";
// // // // // import mongoose from "mongoose";
// // // // // import dotenv from "dotenv";
// // // // // import cors from "cors";

// // // // // dotenv.config();

// // // // // const app = express();
// // // // // app.use(cors());
// // // // // app.use(express.json());

// // // // // // Test route
// // // // // app.get("/", (req, res) => {
// // // // //   res.send("YouTube Clone API is running!");
// // // // // });

// // // // // // Connect to MongoDB
// // // // // mongoose.connect(process.env.MONGO_URI)
// // // // //   .then(() => {
// // // // //     console.log("MongoDB connected!");
// // // // //     app.listen(process.env.PORT || 5000, () => {
// // // // //       console.log(`Server running on port ${process.env.PORT || 5000}`);
// // // // //     });
// // // // //   })
// // // // //   .catch((err) => console.error(err));









// // // // const express = require("express");
// // // // const mongoose = require("mongoose");
// // // // const dotenv = require("dotenv");
// // // // const cors = require("cors");

// // // // dotenv.config();

// // // // const app = express();
// // // // app.use(cors());
// // // // app.use(express.json());

// // // // app.get("/", (req, res) => {
// // // //   res.send("YouTube Clone API is running!");
// // // // });

// // // // mongoose.connect(process.env.MONGO_URI)
// // // //   .then(() => {
// // // //     console.log("MongoDB connected!");
// // // //     app.listen(process.env.PORT || 5000, () => {
// // // //       console.log(`Server running on port ${process.env.PORT || 5000}`);
// // // //     });
// // // //   })
// // // //   .catch((err) => console.error(err));







// // // const express = require("express");
// // // const mongoose = require("mongoose");
// // // const dotenv = require("dotenv");
// // // const cors = require("cors");
// // // const authRoutes = require("./routes/authRoutes");

// // // dotenv.config();

// // // const app = express();
// // // app.use(cors());
// // // app.use(express.json());

// // // // Routes
// // // app.use("/api/auth", authRoutes);

// // // app.get("/", (req, res) => {
// // //   res.send("YouTube Clone API is running!");
// // // });

// // // mongoose.connect(process.env.MONGO_URI)
// // //   .then(() => {
// // //     console.log("MongoDB connected!");
// // //     app.listen(process.env.PORT || 5000, () => {
// // //       console.log(`Server running on port ${process.env.PORT || 5000}`);
// // //     });
// // //   })
// // //   .catch((err) => console.error(err));



// // const express = require("express");
// // const mongoose = require("mongoose");
// // const dotenv = require("dotenv");
// // const cors = require("cors");
// // const authRoutes = require("./routes/authRoutes");
// // const videoRoutes = require("./routes/videoRoutes");

// // dotenv.config();

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // app.use("/api/auth", authRoutes);
// // app.use("/api/videos", videoRoutes);

// // app.get("/", (req, res) => {
// //   res.send("YouTube Clone API is running!");
// // });

// // mongoose.connect(process.env.MONGO_URI)
// //   .then(() => {
// //     console.log("MongoDB connected!");
// //     app.listen(process.env.PORT || 5000, () => {
// //       console.log(`Server running on port ${process.env.PORT || 5000}`);
// //     });
// //   })
// //   .catch((err) => console.error(err));










// const dotenv = require("dotenv");
// dotenv.config(); // 👈 Must be FIRST before anything else


//   console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const authRoutes = require("./routes/authRoutes");
// const videoRoutes = require("./routes/videoRoutes");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/videos", videoRoutes);

// app.get("/", (req, res) => {
//   res.send("YouTube Clone API is running!");
// });

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected!");
//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`Server running on port ${process.env.PORT || 5000}`);
//     });
//   })
//   .catch((err) => console.error(err));




const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("YouTube Clone API is running!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error(err));