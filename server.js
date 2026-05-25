const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// When user connects
io.on("connection", (socket) => {

  console.log("User connected");

  // Join room
  socket.on("join-room", (room) => {

    socket.join(room);

    console.log(`User joined room: ${room}`);
  });

  // Receive message
  socket.on("chat-message", (data) => {

    console.log(data);

    // Send message to everyone in room
    io.to(data.room).emit("chat-message", {
      message: data.message
    });
  });

  // Disconnect
  socket.on("disconnect", () => {

    console.log("User disconnected");
  });
});

// Start server
server.listen(3000, () => {

  console.log("Server running on port 3000");
});