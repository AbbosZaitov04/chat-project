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

io.on("connection", (socket) => {

  console.log("User connected");

  socket.on("chat-message", (message) => {

    console.log(message);

    // Send to EVERYONE
    io.emit("chat-message", message);
  });

  socket.on("disconnect", () => {

    console.log("User disconnected");
  });
});

server.listen(3000, () => {

  console.log("Server running on port 3000");
});