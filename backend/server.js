// backend/server.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db"); // DB connection function
const authRoutes = require("./routes/authRoutes");

const app = express();

// -------------------- MIDDLEWARES -------------------- //

// Allow requests from frontend 
const allowedOrigins = [
  "http://localhost:5173",         // local frontend 
   // add deployed frontend later
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow sending cookies with requests
  })
);

app.use(express.json());       // parse incoming JSON
app.use(cookieParser());       // parse cookies for JWT/session

// -----------------ROUTES--------------------

// Test route
app.get("/", (req, res) => res.send("Server is running"));

// Auth routes (register, login, logout, profile, admin functions)
app.use("/api/users", authRoutes);

// --------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
});

// -----------------START SERVER-------------------
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
