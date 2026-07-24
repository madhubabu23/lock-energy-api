// src/routes/authRoutes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

/**
 * Authentication Routes
 *
 * Base URL:
 * /api/v1/auth
 */

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

// Authentication Status
router.get("/status", authController.status);

module.exports = router;
