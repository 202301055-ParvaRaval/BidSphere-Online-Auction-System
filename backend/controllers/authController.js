// backend/controllers/authController.js
//Controller functions for authentication routes: register, login, logout, getMe(current user)
const User = require("../models/User"); //Import User model
const jwt = require("jsonwebtoken"); //For JWT token creation and verification

// Written a helper function to create cookie options based on rememberMe
const createCookieOptions = (rememberMe) => {
  const secure = process.env.NODE_ENV === "production";
  const maxAge = rememberMe
    ? parseInt(process.env.COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000, 10)  // default 7d
    : parseInt(process.env.COOKIE_MAX_AGE_MS_SESSION || 24 * 60 * 60 * 1000, 10); // default 1d
  return {
    httpOnly: true, //This prevents client-side JS from reading the cookie
    secure, //Transmit cookie over HTTPS only in production
    sameSite: "lax", //Balanced CSRF protection(can also use 'strict' for more security)
    maxAge //Cookie expiration time as set above
  };
};

// Also written a helper function to sign JWT tokens with variable expiration
const signToken = (payload, rememberMe) => {
  const expiresIn = rememberMe ? (process.env.JWT_EXPIRES_REMEMBER || "7d") : (process.env.JWT_EXPIRES || "1d");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

//----------------Register-----------------------
exports.registerUser = (req, res) => {
  //Basic validation
  const { name, email, password, role, rememberMe } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Provide name, email, password" });

  //Check if user already exists
  User.findOne({ email })
    .then((existing) => {
      if (existing) return res.status(400).json({ message: "User already exists" });

      //Created a new user
      const newUser = new User({ name, email, password, role }); // Passowrd will be hashed in pre-save middleware
      
      newUser.save()
        .then((saved) => {
          //Generate JWT token and set cookie
          const token = signToken({ id: saved._id, role: saved.role }, rememberMe);
          res.cookie("token", token, createCookieOptions(rememberMe));

          //Send back user info (but not sent password)
          res.status(201).json({
            user: { id: saved._id, name: saved.name, email: saved.email, role: saved.role }
          });
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

//----------------Login-----------------------
exports.loginUser = (req, res) => {
  //Again Basic validation
  const { email, password, rememberMe } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Provide email and password" });

  //Check if user exists
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      //Compare entered password with hashed password
      user.matchPassword(password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        //Generate JWT token and set cookie
        const token = signToken({ id: user._id, role: user.role }, rememberMe);
        res.cookie("token", token, createCookieOptions(rememberMe));
        
        //Send back user info (but not sent password)
        res.json({
          user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

//----------------Logout-----------------------
exports.logoutUser = (req, res) => {
  //Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.json({ message: "Logged out" });
};

//----------------Get Current User-----------------------
exports.getMe = (req, res) => {
  // req.user is set in authMiddleware's protect function
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ user: req.user });
};
