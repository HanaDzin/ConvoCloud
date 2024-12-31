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

// set up listening for any incoming connections
io.on("connection", (socket) => {
  console.log("A user connected ", socket.id); // every time someone connects, they are assigned a socket

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id); // listen for disconnection of the socket
  });
});

export { io, app, server };
