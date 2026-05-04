const { join } = require("path");

/** @type {import("puppeteer").Configuration} */
module.exports = {
  // Chrome lives inside the project directory — same path at build time and runtime
  cacheDirectory: join(__dirname, ".puppeteer-cache"),
};
