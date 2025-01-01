import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

import { connectToDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { app, server } from "./lib/utils/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// function to create directories if they don't exist to ensure image uploads
const createDirectories = () => {
  const dirs = ["uploads/attachments", "uploads/profile-pics"];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirectories();

app.use(express.json()); // allows to extract json data out of incoming req body
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const __dirname = path.resolve();

// middleware to serve static files from the /uploads folder to the user
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectToDB();
});
