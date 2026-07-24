// src/routes/meterRoutes.js

const express = require("express");
const router = express.Router();

const meterController = require("../controllers/meterController");
const {
    ensureAuthenticated
} = require("../middleware/authMiddleware");

/**
 * Meter Routes
 *
 * Base URL:
 * /api/v1/meters
 */

// Get all smart meters
router.get(
    "/",
    ensureAuthenticated,
    meterController.getMeters
);

// Get meter details
router.get(
    "/:id",
    ensureAuthenticated,
    meterController.getMeterById
);

// Get consumption history
router.get(
    "/:id/consumption",
    ensureAuthenticated,
    meterController.getConsumption
);

// Optional Assignment Extension
// Get network hierarchy
router.get(
    "/hierarchy/all",
    ensureAuthenticated,
    meterController.getHierarchy
);

module.exports = router;
