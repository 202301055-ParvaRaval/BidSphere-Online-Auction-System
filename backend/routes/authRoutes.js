// backend/routes/authRoutes.js
//Authentication & User related routes
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");
const { protect, roleCheck } = require("../middleware/authMiddleware");

//---------Auth Routes---------
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (public)
 * @access  Public
 */
router.post("/register", authController.registerUser);
/**
 * @route   POST /api/auth/login
 * @desc    Login user & set authentication cookie
 * @access  Public
 */
router.post("/login", authController.loginUser);
/**
 * @route   POST /api/auth/logout
 * @desc    Clear authentication cookie
 * @access  Public (requires existing cookie to clear)
 */
router.post("/logout", authController.logoutUser);
/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user
 * @access  Private
 */
router.get("/me", protect, authController.getMe);

//---------Admin Routes---------
/**
 * @route   GET /api/auth/all-users
 * @desc    Fetch all users (excluding passwords)
 * @access  Private (Admin only)
 */
router.get("/all-users", protect, roleCheck(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;