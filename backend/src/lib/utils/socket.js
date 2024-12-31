// build a socket.io server on top of existing Node.js server
// this means that the app from index.js will be replaced with this server
import { Server } from "socket.io";
import http from "http"; // built-in node module
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// keep track of online users - key-value: userId-socketId
const userSocketMap = {};

// set up listening for any incoming connections
io.on("connection", (socket) => {
  console.log("A user connected ", socket.id); // every time someone connects, they are assigned a socket

  const userId = socket.handshake.query.userId; // userId passed from connectSocket when creating a new socket
  if (userId) {
    userSocketMap[userId] = socket.id; // update the userSocket map to make this user appear online
  }
  // emitting an event to ALL connected users to let them know this user is online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected ", socket.id); // listen for disconnection of the socket
    delete userSocketMap[userId]; // update the online users map
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // broadcast to all users to reflect the changes
  });
});

export { io, app, server };
