const { Pool } = require("pg");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());

const server = http.createServer(app);

app.post("/register", async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password required"
    });
  }

  try {

    await pool.query(
      "INSERT INTO users(username, password) VALUES($1, $2)",
      [username, password]
    );

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      error: "Username may already exist"
    });
  }
});

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const pool = new Pool({
  connectionString: "postgresql://chatuser:3XTynvGbC4XYVzF9znP4ojNU1Uo90cPR@dpg-d89vbabbc2fs73fk4tr0-a.frankfurt-postgres.render.com/chatdb_m4bt",
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

io.on("connection", async (socket) => {

  console.log("User connected");
  const result = await pool.query(
  "SELECT * FROM messages ORDER BY id ASC"
);

socket.emit("load-messages", result.rows);

socket.on("chat-message", async (message) => {

  console.log(message);

  // Save message into database
  await pool.query(
    "INSERT INTO messages(text) VALUES($1)",
    [message]
  );

  // Send message to everyone
  io.emit("chat-message", message);
});

  socket.on("disconnect", () => {

    console.log("User disconnected");
  });
});

server.listen(3000, () => {

  console.log("Server running on port 3000");
});