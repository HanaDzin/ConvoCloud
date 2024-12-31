import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectToDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { app, server } from "./lib/utils/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

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

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectToDB();
});
