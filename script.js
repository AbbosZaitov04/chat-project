// Connect to backend server
const socket = io("http://localhost:3000");

// HTML elements
const joinSection = document.getElementById("joinSection");
const chatSection = document.getElementById("chatSection");

const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");

const roomTitle = document.getElementById("roomTitle");

const messages = document.getElementById("messages");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Current room
let currentRoom = "";

// Join room
joinBtn.addEventListener("click", () => {

  const room = roomInput.value.trim();

  if (room === "") return;

  currentRoom = room;

  // Tell server to join room
  socket.emit("join-room", room);

  // Update UI
  roomTitle.textContent = `Room: ${room}`;

  joinSection.style.display = "none";
  chatSection.style.display = "block";
});

// Send message
sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {

  const text = messageInput.value.trim();

  if (text === "") return;

  // Send to server
  socket.emit("chat-message", {
    room: currentRoom,
    message: text
  });

  messageInput.value = "";
}

// Receive message from server
socket.on("chat-message", (data) => {

  const div = document.createElement("div");

  div.classList.add("message");

  div.textContent = data.message;

  messages.appendChild(div);

  // Auto scroll
  messages.scrollTop = messages.scrollHeight;
});