// src/controllers/authController.js

const urjaClient = require("../client/urjaClient");

/**
 * @desc Login to Urja Portal
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required."
      });
    }

    // Login through Urja client
    const loggedIn = await urjaClient.login(username, password);

    if (!loggedIn) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully logged in to Urja Portal."
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message
    });
  }
};

/**
 * @desc Check Login Status
 * @route GET /api/v1/auth/status
 * @access Public
 */
const status = async (req, res) => {
  try {
    const authenticated = urjaClient.isAuthenticated();

    return res.status(200).json({
      success: true,
      authenticated
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to determine authentication status."
    });
  }
};

/**
 * @desc Logout
 * @route POST /api/v1/auth/logout
 * @access Public
 */
const logout = async (req, res) => {
  try {

    await urjaClient.logout();

    return res.status(200).json({
      success: true,
      message: "Logged out successfully."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Logout failed.",
      error: error.message
    });
  }
};

/**
 * Export Controller Methods
 */
module.exports = {
  login,
  status,
  logout
};
