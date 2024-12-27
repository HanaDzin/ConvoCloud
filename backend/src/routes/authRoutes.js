import express from "express";
import { upload } from "../lib/utils/multer.js";
import {
  login,
  logout,
  signup,
  updateProfilePic,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

// this route is protected so only a logged-in user can reach it
authRoutes.put("/update-profile-pic", protectRoute, upload.single('profilePic'), updateProfilePic);

export default authRoutes;
