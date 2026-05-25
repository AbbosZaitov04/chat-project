const registerBtn = document.getElementById("registerBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const statusText = document.getElementById("status");
const registerView = document.getElementById("registerView");
const chatView = document.getElementById("chatView");
const currentUser = document.getElementById("currentUser");
const messages = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? window.location.origin
    : "https://chat-project-ftla.onrender.com";
let socket;
let currentUsername = "";

registerBtn.addEventListener("click", register);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    register();
  }
});
chatForm.addEventListener("submit", sendMessage);

async function register() {

  const username = usernameInput.value.trim();

  const password = passwordInput.value.trim();

  if (!username || !password) {

    statusText.textContent =
      "Fill all fields";

    return;
  }

  try {

    registerBtn.disabled = true;
    statusText.textContent = "Creating account...";

    const response = await fetch(
      `${API_BASE_URL}/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      openChat(username);

    } else {

      statusText.textContent =
        data.error || "Error";
    }

  } catch (err) {

    statusText.textContent =
      "Server error";
  } finally {

    registerBtn.disabled = false;
  }
}

function openChat(username) {
  currentUsername = username;
  registerView.classList.add("hidden");
  chatView.classList.remove("hidden");
  currentUser.textContent = `Signed in as ${username}`;

  if (socket) {
    socket.disconnect();
  }

  socket = io(API_BASE_URL);

  socket.on("load-messages", (loadedMessages) => {
    messages.innerHTML = "";
    loadedMessages.forEach((message) => {
      addMessage(message);
    });
  });

  socket.on("chat-message", addMessage);
}

function sendMessage(event) {
  event.preventDefault();

  const text = chatInput.value.trim();

  if (!text || !socket) {
    return;
  }

  socket.emit("chat-message", {
    username: currentUsername,
    text
  });
  chatInput.value = "";
}

function addMessage(message) {
  const username = message.username || "Unknown";
  const text = message.text || message;

  const messageElement = document.createElement("div");
  messageElement.className = "message";

  const authorElement = document.createElement("div");
  authorElement.className = "message-author";
  authorElement.textContent = username;

  const textElement = document.createElement("div");
  textElement.className = "message-text";
  textElement.textContent = text;

  messageElement.appendChild(authorElement);
  messageElement.appendChild(textElement);
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}
