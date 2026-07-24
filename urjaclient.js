// src/client/urjaClient.js

const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const cheerio = require("cheerio");
const config = require("../config/config");

class UrjaClient {
  constructor() {
    this.jar = new CookieJar();

    this.client = wrapper(
      axios.create({
        baseURL: config.urja.baseUrl,
        jar: this.jar,
        withCredentials: true,
        timeout: config.urja.timeout
      })
    );

    this.loggedIn = false;
  }

  async login() {
    // Replace with the actual login request
    const response = await this.client.post(
      config.urja.loginEndpoint,
      {
        username: config.urja.username,
        password: config.urja.password
      }
    );

    this.loggedIn = response.status === 200 || response.status === 302;

    return this.loggedIn;
  }

  async ensureLogin() {
    if (!this.loggedIn) {
      await this.login();
    }
  }

  async request(method, url, options = {}) {
    await this.ensureLogin();

    try {
      return await this.client({
        method,
        url,
        ...options
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        await this.login();

        return this.client({
          method,
          url,
          ...options
        });
      }

      throw err;
    }
  }

  async getMeters() {
    const response = await this.request(
      "GET",
      "/meters" // Replace with actual endpoint
    );

    return this.parseMeters(response.data);
  }

  async getMeterDetails(id) {
    const response = await this.request(
      "GET",
      `/meters/${id}` // Replace with actual endpoint
    );

    return this.parseMeter(response.data, id);
  }

  async getConsumption(id) {
    const response = await this.request(
      "GET",
      `/meters/${id}/consumption` // Replace with actual endpoint
    );

    return this.parseConsumption(response.data);
  }

  parseMeters(html) {
    const $ = cheerio.load(html);

    const meters = [];

    // Replace selectors after inspecting the portal
    $("table tbody tr").each((_, row) => {
      const cols = $(row).find("td");

      meters.push({
        id: $(cols[0]).text().trim(),
        serialNumber: $(cols[1]).text().trim(),
        status: $(cols[2]).text().trim()
      });
    });

    return meters;
  }

  parseMeter(html, meterId) {
    const $ = cheerio.load(html);

    return {
      meterId,
      serialNumber: $("#meter-serial").text().trim(),
      status: $(".status-value").text().trim()
    };
  }

  parseConsumption(html) {
    const $ = cheerio.load(html);

    const history = [];

    $("table tbody tr").each((_, row) => {
      const cols = $(row).find("td");

      history.push({
        date: $(cols[0]).text().trim(),
        consumption: $(cols[1]).text().trim()
      });
    });

    return history;
  }
}

module.exports = new UrjaClient();
