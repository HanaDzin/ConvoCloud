import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectToDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows to extract json data out of incoming req body
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url); // locate this file
const __dirname = path.dirname(__filename); // locate the directory of this file

// ensure the /uploads/profile-pics directory exists (to be created at deployment)
const uploadDir = path.join(__dirname, "../uploads/profile-pics");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Directory created at ${uploadDir}`);
}

// middleware to serve static files from the /uploads folder to the user
app.use("/uploads", express.static(uploadDir));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectToDB();
});
