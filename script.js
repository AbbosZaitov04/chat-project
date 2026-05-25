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

const API_BASE_URL = "https://chat-project-ftla.onrender.com";
let socket;

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
      addMessage(message.text);
    });
  });

  socket.on("chat-message", addMessage);
}

function sendMessage(event) {
  event.preventDefault();

  const message = chatInput.value.trim();

  if (!message || !socket) {
    return;
  }

  socket.emit("chat-message", message);
  chatInput.value = "";
}

function addMessage(text) {
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.textContent = text;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}
