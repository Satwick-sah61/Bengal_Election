/**
 * ECI results scraper — uses Puppeteer to render the page like a real browser,
 * intercepts the underlying JSON API call if one exists, falls back to DOM parsing.
 * Saves normalised party + constituency data to results.json.
 *
 * Usage:
 *   node scraper.js                  (one shot)
 *   node scraper.js --watch 60       (poll every 60 seconds)
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const RESULTS_FILE = path.join(__dirname, "results.json");
const ECI_URL = process.env.ECI_RESULTS_URL ||
  "https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S25.htm";

// ── Normalise whatever ECI gives us into our schema ─────────────────────────

function normParty(raw) {
  if (!raw || typeof raw !== "object") return null;
  // JSON API shape (varies by election)
  const party = raw.party_abrviation || raw.party_abbreviation || raw.partyAbr ||
    raw.Party_Abbreviation || raw.abbr || raw.SHORT_NAME || raw.party || "";
  const name  = raw.party_name || raw.partyName || raw.Party_Name || raw.name || party;
  const won     = Number(raw.won     ?? raw.Won     ?? raw.WIN ?? 0);
  const leading = Number(raw.leading ?? raw.Leading ?? raw.LEAD ?? raw.lead ?? 0);
  const total   = Number(raw.total   ?? raw.Total   ?? raw.TOTAL ?? won + leading);
  if (!party || total < 0) return null;
  return { party: party.trim(), name: String(name).trim(), won, leading, total };
}

function normConstituency(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id       = raw.ac_no    ?? raw.AC_NO    ?? raw.constituency_no ?? null;
  const name     = raw.ac_name  ?? raw.AC_NAME  ?? raw.constituency    ?? raw.name ?? "";
  const district = raw.district ?? raw.District  ?? raw.dist_name      ?? "";
  const winner   = raw.winner   ?? raw.candidate_name ?? raw.leading_cand_name ?? "";
  const party    = raw.party    ?? raw.party_abrviation ?? raw.leading_party ?? "";
  const status   = raw.status   ?? (raw.result === "W" ? "won" : "leading");
  const votes    = Number(raw.total_votes ?? raw.totalVotes ?? 0);
  const margin   = Number(raw.margin ?? raw.Margin ?? 0);
  return { id, name: String(name).trim(), district: String(district).trim(),
    winner: String(winner).trim(), party: String(party).trim(), status, votes, margin };
}

// ── DOM parser (fallback if no JSON API is found) ───────────────────────────

function parseDom(html) {
  // Runs inside page.evaluate — no require() available
  const rows = [];
  const tables = document.querySelectorAll("table");
  tables.forEach((table) => {
    const headers = [...table.querySelectorAll("th")].map((h) => h.textContent.trim().toLowerCase());
    const hasWon  = headers.some((h) => h.includes("won"));
    const hasLead = headers.some((h) => h.includes("lead"));
    if (!hasWon && !hasLead) return;
    table.querySelectorAll("tr").forEach((tr) => {
      const cells = [...tr.querySelectorAll("td")].map((td) => td.textContent.trim());
      if (cells.length < 3) return;
      // Last 3 numeric cells = won / leading / total
      const nums = cells.map((c) => Number(c.replace(/[^\d]/g, ""))).filter((n, i, a) => {
        const orig = cells[i].replace(/\s/g, "");
        return /^\d+$/.test(orig);
      });
      if (nums.length < 3) return;
      const partyCell = cells[0];
      const dash = partyCell.match(/^(.+?)\s*[-–]\s*([A-Z()\s]+)$/);
      if (!dash) return;
      const abbrev = dash[2].trim();
      const won     = nums[nums.length - 3];
      const leading = nums[nums.length - 2];
      const total   = nums[nums.length - 1];
      if (total !== won + leading) return;
      rows.push({ party: abbrev, name: partyCell.trim(), won, leading, total });
    });
  });

  // Last-updated text
  const all = document.body?.innerText || "";
  const updated = all.match(/(?:last\s+updated|as\s+on)[^\n]{0,80}/i)?.[0]?.trim() || null;
  return { rows, updated };
}

// ── Main scrape function ─────────────────────────────────────────────────────

async function scrape() {
  console.log(`[scraper] Launching browser → ${ECI_URL}`);
  const browser = await puppeteer.launch({
    headless: "new",
    // On Render the cache is set via PUPPETEER_CACHE_DIR env var;
    // executablePath falls back to Puppeteer's bundled Chrome automatically.
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--single-process",   // critical for Render free tier (512 MB RAM)
      "--no-zygote",
      "--disable-background-networking",
      "--disable-default-apps"
    ]
  });

  try {
    const page = await browser.newPage();

    // Realistic browser fingerprint
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    });

    // Capture JSON API responses
    const captured = { parties: [], constituencies: [], lastUpdated: null, apiHit: false };

    page.on("response", async (response) => {
      const url   = response.url();
      const ct    = response.headers()["content-type"] || "";
      const status = response.status();
      if (status !== 200 || !ct.includes("json")) return;
      if (!/result|party|candidate|tally|count/i.test(url)) return;

      try {
        const json = await response.json();
        console.log(`[scraper] JSON hit: ${url}`);

        // party-wise array
        const partyArr = json.party_wise || json.partyWise || json.parties ||
          json.result?.party_wise || (Array.isArray(json) ? json : null);
        if (partyArr?.length) {
          const rows = partyArr.map(normParty).filter(Boolean);
          if (rows.length) { captured.parties = rows; captured.apiHit = true; }
        }

        // constituency-wise array
        const acArr = json.ac_wise || json.constituency_wise || json.constituencies ||
          json.result?.ac_wise;
        if (acArr?.length) {
          captured.constituencies = acArr.map(normConstituency).filter(Boolean);
        }

        if (json.last_updated || json.lastUpdated || json.updated_time) {
          captured.lastUpdated = json.last_updated || json.lastUpdated || json.updated_time;
        }
      } catch { /* non-JSON or streaming */ }
    });

    // Navigate
    await page.goto(ECI_URL, { waitUntil: "networkidle2", timeout: 45000 });

    // Also look for embedded JSON in <script> tags
    if (!captured.apiHit) {
      const scriptData = await page.evaluate(() => {
        for (const s of document.querySelectorAll("script")) {
          const t = s.textContent || "";
          const m = t.match(/(?:window\.\w+\s*=\s*|var\s+\w+\s*=\s*)(\[.*?\]|\{.*?\})/s);
          if (m) { try { return JSON.parse(m[1]); } catch { continue; } }
        }
        return null;
      });
      if (scriptData) {
        console.log("[scraper] Found embedded JSON in page scripts");
        const rows = (Array.isArray(scriptData) ? scriptData : scriptData.parties || [])
          .map(normParty).filter(Boolean);
        if (rows.length) { captured.parties = rows; captured.apiHit = true; }
      }
    }

    // DOM fallback
    if (!captured.parties.length) {
      console.log("[scraper] No JSON API found — parsing DOM table");
      const { rows, updated } = await page.evaluate(parseDom);
      captured.parties = rows;
      if (updated && !captured.lastUpdated) captured.lastUpdated = updated;
    }

    // Extract last-updated from page text if not found yet
    if (!captured.lastUpdated) {
      captured.lastUpdated = await page.evaluate(() => {
        const text = document.body?.innerText || "";
        return text.match(/(?:last\s+updated|as\s+on)[^\n]{0,80}/i)?.[0]?.trim() || null;
      });
    }

    await browser.close();

    if (!captured.parties.length) {
      console.warn("[scraper] No party data found — page may still be loading or URL is wrong");
      return false;
    }

    const out = {
      configured: true,
      source: ECI_URL,
      fetchedAt: new Date().toISOString(),
      lastUpdated: captured.lastUpdated || new Date().toLocaleString("en-IN"),
      parties: captured.parties.sort((a, b) => b.total - a.total),
      constituencies: captured.constituencies
    };

    fs.writeFileSync(RESULTS_FILE, JSON.stringify(out, null, 2));
    console.log(`[scraper] Saved: ${captured.parties.length} parties, ${captured.constituencies.length} constituencies`);
    return true;

  } catch (err) {
    await browser.close().catch(() => {});
    console.error(`[scraper] Error: ${err.message}`);
    return false;
  }
}

// ── CLI entrypoint ───────────────────────────────────────────────────────────

if (require.main === module) {
  const watchArg = process.argv.indexOf("--watch");
  const interval = watchArg !== -1 ? Number(process.argv[watchArg + 1] || 90) : 0;

  scrape().then((ok) => {
    if (!ok) process.exitCode = 1;
    if (interval > 0) {
      console.log(`[scraper] Polling every ${interval}s`);
      setInterval(scrape, interval * 1000);
    } else if (ok) {
      process.exit(0);
    }
  });
}

module.exports = { scrape };
