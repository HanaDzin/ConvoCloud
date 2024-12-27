import express from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);

messageRouter.get("/:receiverId", protectRoute, getMessages);

messageRouter.post("send/:receiverId", protectRoute, sendMessage);

export default messageRouter;
