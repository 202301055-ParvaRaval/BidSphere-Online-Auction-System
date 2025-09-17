// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes by validating JWT token
 * - Extracts token from cookies
 * - Verifies and decodes JWT
 * - Attaches authenticated user (without password) to req.user
 */
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token; //Retrieve token from cookies
    //No token means not authorized
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    next();// Proceed to next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// Middleware to check if user has one of the required roles
const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    //Deny if user's role is not in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    //User has required role, proceed
    next();
  };
};

module.exports = { protect, roleCheck };