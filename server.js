const http = require("http");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { spawn } = require("child_process");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const RESULTS_FILE = path.join(root, "results.json");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const ECI_RESULTS_URL = process.env.ECI_RESULTS_URL || "";
const CACHE_MS = Number(process.env.ECI_CACHE_MS || 60000);
let eciCache = { at: 0, data: null };

// --- results.json file-based data source ---
function readResultsFile() {
  try {
    const raw = fs.readFileSync(RESULTS_FILE, "utf8");
    const data = JSON.parse(raw);
    data.source = "results.json";
    data.configured = true;
    if (!data.fetchedAt) data.fetchedAt = new Date(fs.statSync(RESULTS_FILE).mtimeMs).toISOString();
    return data;
  } catch {
    return null;
  }
}

// --- ECI HTTP fetch ---
function fetchText(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) { reject(new Error("Too many redirects")); return; }
    const parsed = new URL(url);
    const mod = parsed.protocol === "https:" ? https : require("http");
    mod.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.5",
        "Referer": "https://results.eci.gov.in/"
      }
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        resolve(fetchText(new URL(res.headers.location, url).toString(), redirects + 1));
        res.resume();
        return;
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve(body));
    }).on("error", reject);
  });
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function parsePartyRows(html) {
  const rows = [];
  const seen = new Set();

  // Strategy 1: parse <tr> cells looking for party abbreviation + 3 numbers
  const rowRe = /<tr[\s\S]*?<\/tr>/gi;
  let m;
  while ((m = rowRe.exec(html))) {
    const cells = [...m[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map((c) => stripTags(c[1]).trim());
    if (cells.length < 3) continue;

    // Look for pattern: first cell has party name/abbrev, last 3 numeric cells = won/leading/total
    const nums = cells.map((c) => {
      const n = Number(c.replace(/[^\d]/g, ""));
      return Number.isFinite(n) ? n : NaN;
    });
    const numCells = nums.filter((n) => !isNaN(n) && n >= 0);
    if (numCells.length < 3) continue;

    const partyCell = cells[0];
    // Must look like a party row — abbreviation in caps after dash, or all-caps abbreviation
    const dashMatch = partyCell.match(/^(.+?)\s*[-–]\s*([A-Z()]+(?:\([A-Z]+\))?)$/);
    const capsMatch = !dashMatch && partyCell.match(/^([A-Z][A-Z()\s]{1,20})$/);
    if (!dashMatch && !capsMatch) continue;

    const abbrev = dashMatch ? dashMatch[2].trim() : capsMatch[1].trim();
    const name = dashMatch ? partyCell.trim() : abbrev;
    if (seen.has(abbrev)) continue;

    const won = numCells[numCells.length - 3];
    const leading = numCells[numCells.length - 2];
    const total = numCells[numCells.length - 1];
    if (total !== won + leading) continue; // sanity check
    if (total === 0 && won === 0 && leading === 0) continue;

    seen.add(abbrev);
    rows.push({ party: abbrev, name, won, leading, total });
  }
  if (rows.length) return rows.sort((a, b) => b.total - a.total);

  // Strategy 2: plain-text fallback
  const text = stripTags(html);
  const section = text.split(/party.wise.result/i).pop()?.split(/constituency.wise/i)[0] || text;
  const re = /([A-Za-z][A-Za-z ()\-'.]+?)\s*[-–]\s*([A-Z()]+)\s+(\d+)\s+(\d+)\s+(\d+)/g;
  while ((m = re.exec(section))) {
    const abbrev = m[2].trim();
    if (seen.has(abbrev)) continue;
    const won = Number(m[3]), leading = Number(m[4]), total = Number(m[5]);
    if (total !== won + leading) continue;
    seen.add(abbrev);
    rows.push({ party: abbrev, name: m[1].trim(), won, leading, total });
  }
  return rows.sort((a, b) => b.total - a.total);
}

function parseLastUpdated(html) {
  const text = stripTags(html);
  return text.match(/(?:Last\s+Updated|As\s+on)[^.]*?\d{1,2}[:/]\d{2}[^.]{0,40}/i)?.[0]?.trim() || null;
}

async function getEciData() {
  if (!ECI_RESULTS_URL) return null;
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

// --- /api/results — serves party-wise tally from best available source ---
async function handleResults(res) {
  // Priority 1: results.json file
  const fileData = readResultsFile();
  if (fileData && fileData.parties?.length) {
    send(res, 200, fileData);
    return;
  }

  // Priority 2: ECI URL
  if (ECI_RESULTS_URL) {
    try {
      const eciData = await getEciData();
      if (eciData) { send(res, 200, eciData); return; }
    } catch (err) {
      send(res, 200, {
        configured: true, source: ECI_RESULTS_URL,
        error: err.message, parties: [], lastUpdated: null,
        fetchedAt: new Date().toISOString()
      });
      return;
    }
  }

  // Priority 3: no source configured
  send(res, 200, {
    configured: false, source: null, parties: [], lastUpdated: null,
    message: "No data source configured. Set ECI_RESULTS_URL env var, or POST party data to /api/results, or place results.json in the app directory."
  });
}

// --- /api/results POST — accept pushed party data ---
function handleResultsPush(req, res) {
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      if (!Array.isArray(data.parties)) throw new Error("Expected { parties: [...] }");
      const out = {
        configured: true,
        source: data.source || "pushed",
        fetchedAt: new Date().toISOString(),
        lastUpdated: data.lastUpdated || new Date().toLocaleString("en-IN"),
        parties: data.parties
      };
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(out, null, 2));
      eciCache = { at: 0, data: null };
      send(res, 200, { ok: true });
    } catch (err) {
      send(res, 400, { error: err.message });
    }
  });
}

function send(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}

// --- static file server ---
http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/results" || url.pathname === "/api/eci") {
    if (req.method === "POST" && url.pathname === "/api/results") {
      handleResultsPush(req, res);
    } else {
      handleResults(res).catch((err) => send(res, 502, { error: err.message }));
    }
    return;
  }

  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(root)) { res.writeHead(403); res.end("Forbidden"); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`Bengal election dashboard on http://${host}:${port}`);
  if (ECI_RESULTS_URL) startScraper();
});

// --- scraper subprocess management ---
const SCRAPE_INTERVAL_MS = Number(process.env.SCRAPE_INTERVAL_MS || 90000); // 90 s default
let scraperRunning = false;

function startScraper() {
  if (scraperRunning) return;
  runScraper();
  setInterval(runScraper, SCRAPE_INTERVAL_MS);
}

function runScraper() {
  if (scraperRunning) return;
  // Check if scraper.js exists
  const scraperPath = path.join(root, "scraper.js");
  if (!fs.existsSync(scraperPath)) {
    console.warn("[server] scraper.js not found — skipping");
    return;
  }
  scraperRunning = true;
  console.log("[server] Starting scraper…");
  const child = spawn(process.execPath, [scraperPath], {
    env: { ...process.env },
    stdio: ["ignore", "inherit", "inherit"]
  });
  child.on("exit", (code) => {
    scraperRunning = false;
    if (code === 0) console.log("[server] Scraper finished OK");
    else console.warn(`[server] Scraper exited with code ${code}`);
  });
  child.on("error", (err) => {
    scraperRunning = false;
    console.error(`[server] Failed to start scraper: ${err.message}`);
  });
}
