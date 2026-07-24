// src/controllers/meterController.js

const urjaClient = require("../client/urjaClient");

/**
 * GET /api/v1/meters
 * Retrieve all smart meters
 */
const getMeters = async (req, res, next) => {
  try {
    const meters = await urjaClient.getMeters();

    return res.status(200).json({
      success: true,
      count: meters.length,
      data: meters,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/meters/:id
 * Retrieve a single meter
 */
const getMeterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meter = await urjaClient.getMeterDetails(id);

    if (!meter) {
      return res.status(404).json({
        success: false,
        message: "Meter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: meter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/meters/:id/consumption
 * Retrieve consumption history
 */
const getConsumption = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consumption = await urjaClient.getConsumption(id);

    return res.status(200).json({
      success: true,
      meterId: id,
      data: consumption,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/hierarchy
 * Optional endpoint
 */
const getHierarchy = async (req, res, next) => {
  try {
    if (typeof urjaClient.getHierarchy !== "function") {
      return res.status(501).json({
        success: false,
        message: "Hierarchy endpoint not implemented",
      });
    }

    const hierarchy = await urjaClient.getHierarchy();

    return res.status(200).json({
      success: true,
      data: hierarchy,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeters,
  getMeterById,
  getConsumption,
  getHierarchy,
};
