const socket = io("https://chat-project-ftla.onrender.com");

const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

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

  socket.emit("chat-message", text);

  messageInput.value = "";
}

// Receive messages
socket.on("chat-message", (message) => {

  const div = document.createElement("div");

  div.classList.add("message");

  div.textContent = message;

  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;
});