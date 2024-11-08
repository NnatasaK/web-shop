import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import {
  authenticateToken,
  authorizeRole,
  inactivityTimeout,
} from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route for admin to create new admins
router.post(
  "/create-admin",
  inactivityTimeout,
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    const { username, password } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the new admin user
    User.createUser(username, hashedPassword, "admin", (err) => {
      if (err) {
        return res.status(500).json({ message: "Error creating admin user" });
      }
      res.status(201).json({ message: "Admin user created successfully" });
    });
  }
);

// Protected routes for users and admins
router.get("/", inactivityTimeout, authenticateToken, (req, res) => {
  res.send("Welcome to the user page");
});

router.get(
  "/adminpage",
  inactivityTimeout,
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.send("Welcome to the admin page");
  }
);

// Route to fetch the last 100 login logs (Admin only)
router.get(
  "/login-logs",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    const query = `SELECT * FROM login_logs ORDER BY time DESC LIMIT 100`;
    db.all(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching login logs" });
      }
      res.status(200).json({ logs: rows });
    });
  }
);

export default router;
