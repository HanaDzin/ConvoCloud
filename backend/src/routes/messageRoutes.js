import express from "express";
import { getUsersForSidebar } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);

export default messageRouter;
