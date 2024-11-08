import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sanitizeInput, sanitizeStrict } from "../utils/inputSanitizer.js";
import User from "../models/userModel.js";
/* import passwordList from "rockyou"; */
import db from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const passwordFilePath = path.join(
  __dirname,
  "../10-million-password-list-top-100000.txt"
);
const passwordList = new Set(
  fs
    .readFileSync(passwordFilePath, "utf-8")
    .split("\n")
    .map((line) => line.trim())
);

// Signup route
export const signup = async (req, res) => {
  const role = "user";
  const username = sanitizeStrict(req.body.username);
  const password = sanitizeInput(req.body.password);

  console.log(typeof passwordList);
  console.log(passwordList);

  if (password === username) {
    return res
      .status(400)
      .json({ message: "Password cannot be the same as the username." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }
  if (/^(\w)\1+$/.test(password)) {
    return res
      .status(400)
      .json({ message: "Password cannot be a single repeated character." });
  }

  if (passwordList.has(password)) {
    return res
      .status(400)
      .json({ message: "Password needs to be more unique." });
  }

  try {
    User.findUserByUsername(username, async (err, existingUser) => {
      if (err) {
        console.error("Error checking if user exists:", err.message);
        return res.status(500).json({ message: "Server error" });
      }

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      User.createUser(username, hashedPassword, role, (err) => {
        if (err) {
          console.error("Error inserting user:", err.message);
          return res.status(500).json({ message: "Error creating user" });
        }
        res.status(201).json({
          message: "User created",
          user: {
            username,
            role,
          },
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
};

// Login route

const failedLoginAttempts = {};

// Function to log login attempt
const logLoginAttempt = (username, success, ip, userAgent) => {
  const query = `
    INSERT INTO login_logs (username, success, ip_address, user_agent)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [username, success, ip, userAgent], (err) => {
    if (err) {
      console.error("Error logging login attempt:", err.message);
    }
  });
};
export const login = (req, res) => {
  const username = sanitizeStrict(req.body.username);
  const password = sanitizeInput(req.body.password);
  const ip = req.ip;
  const userAgent = req.get("User-Agent");

  const MAX_ATTEMPTS = 10;
  const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (failedLoginAttempts[username]) {
    const { count, lastAttempt } = failedLoginAttempts[username];
    const timeSinceLastAttempt = Date.now() - lastAttempt;

    if (count >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_TIME) {
      return res.status(429).json({
        message: "Too many failed login attempts. Please try again later.",
      });
    }

    if (timeSinceLastAttempt >= LOCKOUT_TIME) {
      delete failedLoginAttempts[username];
    }
  }

  User.findUserByUsername(username, async (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      logLoginAttempt(username, false, ip, userAgent);
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logLoginAttempt(username, false, ip, userAgent);
      failedLoginAttempts[username] = failedLoginAttempts[username] || {
        count: 0,
        lastAttempt: Date.now(),
      };
      failedLoginAttempts[username].count += 1;
      failedLoginAttempts[username].lastAttempt = Date.now();
      return res.status(403).json({ message: "Invalid password" });
    }

    // Reset login attempts on successful login
    delete failedLoginAttempts[username];

    const currentTime = Date.now();

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        lastActivity: currentTime,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
      sameSite: "Strict",
      maxAge: 3600000, // Token expiry in milliseconds (1 hour)
    });

    logLoginAttempt(username, true, ip, userAgent);

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        role: user.role,
        userId: user.id,
      },
    });
  });
};

// Logout route
export const logout = (req, res) => {
  res.clearCookie("token"); // Clear the JWT cookie
  res.json({ message: "Logged out successfully" });
};
