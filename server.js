const http = require("http");
const fs = require("fs");
const https = require("https");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const ECI_RESULTS_URL = process.env.ECI_RESULTS_URL || "";
const CACHE_MS = Number(process.env.ECI_CACHE_MS || 120000);
let eciCache = { at: 0, data: null };

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 BengalElectionDashboard/1.0",
        "Accept": "text/html,application/xhtml+xml"
      }
    }, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
        resolve(fetchText(new URL(response.headers.location, url).toString()));
        response.resume();
        return;
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        reject(new Error(`ECI request failed with HTTP ${response.statusCode}`));
        response.resume();
        return;
      }
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => resolve(body));
    }).on("error", reject);
  });
}

function cleanText(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePartyRows(html) {
  const rows = [];
  const rowRe = /<tr[\s\S]*?<\/tr>/gi;
  let match;
  while ((match = rowRe.exec(html))) {
    const row = match[0];
    const cells = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cleanText(cell[1]));
    if (cells.length < 4) continue;
    const combined = cells.join(" ");
    if (!/won/i.test(combined) && !/leading/i.test(combined) && !/total/i.test(combined)) {
      const numbers = cells.map((cell) => Number(cell.replace(/[^\d]/g, ""))).filter(Number.isFinite);
      if (numbers.length >= 3 && /-\s*[A-Z]/.test(cells[0])) {
        const short = cells[0].split(" - ").pop().trim();
        rows.push({
          party: short,
          name: cells[0],
          won: numbers[numbers.length - 3] || 0,
          leading: numbers[numbers.length - 2] || 0,
          total: numbers[numbers.length - 1] || 0
        });
      }
    }
  }
  return rows;
}

function parseLastUpdated(html) {
  return cleanText(html).match(/Last Updated at .*?(?=$| Disclaimer| Party Wise| Constituency Wise)/i)?.[0] || null;
}

async function getEciData() {
  if (!ECI_RESULTS_URL) {
    return {
      configured: false,
      source: null,
      lastUpdated: null,
      parties: [],
      message: "Set ECI_RESULTS_URL to the active official ECI results page when counting starts."
    };
  }
  const now = Date.now();
  if (eciCache.data && now - eciCache.at < CACHE_MS) return eciCache.data;
  const html = await fetchText(ECI_RESULTS_URL);
  const data = {
    configured: true,
    source: ECI_RESULTS_URL,
    fetchedAt: new Date().toISOString(),
    lastUpdated: parseLastUpdated(html),
    parties: parsePartyRows(html)
  };
  eciCache = { at: now, data };
  return data;
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/api/eci") {
    getEciData()
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
        res.end(JSON.stringify(data));
      })
      .catch((error) => {
        res.writeHead(502, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ configured: Boolean(ECI_RESULTS_URL), error: error?.message || String(error) }));
      });
    return;
  }

  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`Bengal election app running on ${host}:${port}`);
});
