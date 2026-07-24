// services/meterService.js

const urjaClient = require("../clients/urjaClient");

class MeterService {
  /**
   * Authenticate with the Urja portal.
   * Login only once if the session is not active.
   */
  async ensureAuthenticated() {
    try {
      if (!urjaClient.isAuthenticated()) {
        await urjaClient.login();
      }
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Get all smart meters.
   */
  async getMeters() {
    await this.ensureAuthenticated();

    try {
      const meters = await urjaClient.getMeters();

      return meters.map((meter) => ({
        id: meter.id,
        serialNumber: meter.serialNumber,
        consumerName: meter.consumerName,
        feeder: meter.feeder,
        transformer: meter.transformer,
        status: meter.status,
        location: meter.location,
      }));
    } catch (error) {
      throw new Error(`Unable to fetch meters: ${error.message}`);
    }
  }

  /**
   * Get meter details.
   * @param {string} meterId
   */
  async getMeterById(meterId) {
    await this.ensureAuthenticated();

    try {
      const meter = await urjaClient.getMeterDetails(meterId);

      if (!meter) {
        throw new Error("Meter not found");
      }

      return {
        id: meter.id,
        serialNumber: meter.serialNumber,
        consumerName: meter.consumerName,
        installationDate: meter.installationDate,
        status: meter.status,
        feeder: meter.feeder,
        transformer: meter.transformer,
        location: meter.location,
        latitude: meter.latitude,
        longitude: meter.longitude,
      };
    } catch (error) {
      throw new Error(`Unable to fetch meter details: ${error.message}`);
    }
  }

  /**
   * Get consumption history.
   * @param {string} meterId
   */
  async getConsumption(meterId) {
    await this.ensureAuthenticated();

    try {
      const history = await urjaClient.getConsumption(meterId);

      return history.map((record) => ({
        date: record.date,
        energyConsumed: Number(record.energyConsumed),
        maximumDemand: Number(record.maximumDemand),
        voltage: Number(record.voltage),
        current: Number(record.current),
        powerFactor: Number(record.powerFactor),
      }));
    } catch (error) {
      throw new Error(`Unable to fetch consumption history: ${error.message}`);
    }
  }

  /**
   * Get network hierarchy.
   */
  async getHierarchy() {
    await this.ensureAuthenticated();

    try {
      return await urjaClient.getHierarchy();
    } catch (error) {
      throw new Error(`Unable to fetch hierarchy: ${error.message}`);
    }
  }

  /**
   * Refresh session manually.
   */
  async refreshSession() {
    try {
      await urjaClient.login();

      return {
        success: true,
        message: "Session refreshed successfully",
      };
    } catch (error) {
      throw new Error(`Unable to refresh session: ${error.message}`);
    }
  }
}

module.exports = new MeterService();
