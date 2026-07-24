// src/middleware/authMiddleware.js

const urjaClient = require("../client/urjaClient");
const config = require("../config/config");

/**
 * Middleware to ensure an authenticated session
 * before accessing protected API endpoints.
 */
const ensureAuthenticated = async (req, res, next) => {
  try {
    // Check if already authenticated
    let authenticated = urjaClient.isAuthenticated();

    // If session expired, try logging in again
    if (!authenticated) {
      console.log("Session expired. Re-authenticating...");

      authenticated = await urjaClient.login(
        config.username,
        config.password
      );
    }

    if (!authenticated) {
      return res.status(401).json({
        success: false,
        message: "Authentication with Urja Portal failed."
      });
    }

    next();
  } catch (error) {
    console.error("Authentication Middleware Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication middleware failed.",
      error: error.message
    });
  }
};

/**
 * Optional middleware to verify login status only.
 */
const checkSession = (req, res, next) => {
  try {
    if (!urjaClient.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "No active Urja session."
      });
    }

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify session.",
      error: error.message
    });
  }
};

module.exports = {
  ensureAuthenticated,
  checkSession
};
