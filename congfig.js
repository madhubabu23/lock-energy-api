// src/config/config.js

require("dotenv").config();

/**
 * Application Configuration
 * Loads environment variables from .env
 */

const config = {
  // Server
  app: {
    name: "Flock Energy REST API Wrapper",
    version: "1.0.0",
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  // Legacy Urja Portal
  urja: {
    baseUrl:
      process.env.BASE_URL || "https://urja-ops.flockenergy.tech",

    loginEndpoint:
      process.env.LOGIN_ENDPOINT || "/login",

    username:
      process.env.USERNAME || "",

    password:
      process.env.PASSWORD || "",

    timeout:
      parseInt(process.env.REQUEST_TIMEOUT, 10) || 15000,

    maxRedirects:
      parseInt(process.env.MAX_REDIRECTS, 10) || 5,
  },

  // Session Settings
  session: {
    autoLogin:
      process.env.AUTO_LOGIN === "false" ? false : true,

    autoReconnect:
      process.env.AUTO_RELOGIN === "false" ? false : true,

    retryAttempts:
      parseInt(process.env.RETRY_ATTEMPTS, 10) || 3,

    retryDelay:
      parseInt(process.env.RETRY_DELAY, 10) || 1000,
  },

  // API Settings
  api: {
    prefix: "/api/v1",
    docs: "/docs",
    openApi: "/openapi.json",
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};

// Validate Required Environment Variables
function validateConfig() {
  const required = [
    "BASE_URL",
    "USERNAME",
    "PASSWORD",
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(", ")}`
    );
  }
}

validateConfig();

module.exports = config;
