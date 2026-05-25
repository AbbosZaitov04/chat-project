const registerBtn = document.getElementById("registerBtn");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const statusText = document.getElementById("status");

registerBtn.addEventListener("click", register);

async function register() {

  const username = usernameInput.value.trim();

  const password = passwordInput.value.trim();

  if (!username || !password) {

    statusText.textContent =
      "Fill all fields";

    return;
  }

  try {

    const response = await fetch(
      "https://chat-project-ftla.onrender.com/register",
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

      statusText.textContent =
        "Account created successfully";

    } else {

      statusText.textContent =
        data.error || "Error";
    }

  } catch (err) {

    statusText.textContent =
      "Server error";
  }
}