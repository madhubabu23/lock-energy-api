// src/utils/parser.js

const cheerio = require("cheerio");

/**
 * Safely get text from an element.
 */
function getText($, selector) {
  const value = $(selector).first().text().trim();
  return value || null;
}

/**
 * Convert string to number.
 */
function toNumber(value) {
  if (!value) return null;

  const number = parseFloat(
    value.replace(/,/g, "").replace(/[^\d.-]/g, "")
  );

  return isNaN(number) ? null : number;
}

/**
 * Convert string to integer.
 */
function toInteger(value) {
  if (!value) return null;

  const number = parseInt(
    value.replace(/[^\d]/g, ""),
    10
  );

  return isNaN(number) ? null : number;
}

/**
 * Parse Meter List Page
 */
function parseMeterList(html) {
  const $ = cheerio.load(html);
  const meters = [];

  $("table tbody tr").each((index, row) => {
    const columns = $(row).find("td");

    if (columns.length < 6) return;

    meters.push({
      id: $(columns[0]).text().trim(),
      serialNumber: $(columns[1]).text().trim(),
      consumerName: $(columns[2]).text().trim(),
      feeder: $(columns[3]).text().trim(),
      transformer: $(columns[4]).text().trim(),
      status: $(columns[5]).text().trim(),
      location:
        columns.length > 6
          ? $(columns[6]).text().trim()
          : null,
    });
  });

  return meters;
}

/**
 * Parse Meter Details Page
 */
function parseMeterDetails(html) {
  const $ = cheerio.load(html);

  return {
    id:
      getText($, "#meter-id") ||
      getText($, ".meter-id"),

    serialNumber:
      getText($, "#meter-serial") ||
      getText($, ".serial-number"),

    consumerName:
      getText($, "#consumer-name") ||
      getText($, ".consumer-name"),

    status:
      getText($, ".status-value") ||
      getText($, "#status"),

    installationDate:
      getText($, "#installation-date"),

    feeder:
      getText($, "#feeder"),

    transformer:
      getText($, "#transformer"),

    location:
      getText($, "#location"),

    latitude:
      toNumber(getText($, "#latitude")),

    longitude:
      toNumber(getText($, "#longitude")),
  };
}

/**
 * Parse Consumption Table
 */
function parseConsumption(html) {
  const $ = cheerio.load(html);

  const history = [];

  $("table tbody tr").each((index, row) => {
    const columns = $(row).find("td");

    if (columns.length < 6) return;

    history.push({
      date: $(columns[0]).text().trim(),
      energyConsumed: toNumber($(columns[1]).text()),
      maximumDemand: toNumber($(columns[2]).text()),
      voltage: toNumber($(columns[3]).text()),
      current: toNumber($(columns[4]).text()),
      powerFactor: toNumber($(columns[5]).text()),
    });
  });

  return history;
}

/**
 * Parse Hierarchy Page
 */
function parseHierarchy(html) {
  const $ = cheerio.load(html);

  const hierarchy = [];

  $(".hierarchy-node").each((index, node) => {
    hierarchy.push({
      id: $(node).attr("data-id") || null,
      name: $(node).find(".node-name").text().trim(),
      type: $(node).find(".node-type").text().trim(),
      parentId: $(node).attr("data-parent") || null,
    });
  });

  return hierarchy;
}

/**
 * Check whether session has expired.
 */
function isLoginPage(html) {
  const $ = cheerio.load(html);

  return (
    $("input[name='username']").length > 0 ||
    $("input[name='password']").length > 0 ||
    html.toLowerCase().includes("login")
  );
}

/**
 * Parse Login Success
 */
function loginSuccessful(html) {
  return !isLoginPage(html);
}

module.exports = {
  parseMeterList,
  parseMeterDetails,
  parseConsumption,
  parseHierarchy,
  isLoginPage,
  loginSuccessful,
  toNumber,
  toInteger,
};
