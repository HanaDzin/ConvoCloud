import express from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

import { upload } from "../lib/utils/multer.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);

messageRouter.get("/:receiverId", protectRoute, getMessages);

messageRouter.post(
  "/send/:receiverId",
  protectRoute,
  upload.single("image"),
  sendMessage
);

export default messageRouter;
