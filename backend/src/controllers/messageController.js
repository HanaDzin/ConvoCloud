import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../lib/utils/socket.js";

// fetch all users from the database, excluding the currently logged in, to show in the sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; //from protectRoute

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params; // passed via the route
    const senderId = req.user._id; // from protectRoute

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in the getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const baseURL =
      process.env.NODE_ENV === "production"
        ? process.env.BASE_URL
        : `${req.protocol}://${req.get("host")}`;

    const imagePath = `${baseURL}/uploads/attachments/${req.file.filename}`;

    // create the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imagePath,
    });

    await newMessage.save();

    // once the message is saved to the db, send it to the receiver in real time (using socket.io)
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in the sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
