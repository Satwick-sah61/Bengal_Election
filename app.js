const PARTIES = {
  TMC: { label: "TMC", full: "Trinamool Congress", color: "#00b44f" },
  BJP: { label: "BJP", full: "Bharatiya Janata Party", color: "#ff6a00" },
  CPIM: { label: "CPIM", full: "CPI (Marxist)", color: "#cc1111" },
  INC: { label: "INC", full: "Indian National Congress", color: "#1565c0" },
  ISF: { label: "ISF", full: "Indian Secular Front", color: "#7b1fa2" }
};

const DISTRICTS = [
  { id: "darjeeling", name: "Darjeeling", region: "North Bengal", seats: 7, poly: [[87.85, 27.30], [88.40, 27.30], [88.42, 26.88], [88.10, 26.50], [87.85, 26.60]] },
  { id: "kalimpong", name: "Kalimpong", region: "North Bengal", seats: 3, poly: [[88.40, 27.15], [88.90, 27.00], [88.93, 26.55], [88.40, 26.50]] },
  { id: "jalpaiguri", name: "Jalpaiguri", region: "North Bengal", seats: 8, poly: [[88.10, 26.95], [88.42, 26.95], [88.93, 26.88], [89.05, 26.40], [88.93, 26.15], [88.30, 26.10], [88.00, 26.25], [88.00, 26.65]] },
  { id: "alipurduar", name: "Alipurduar", region: "North Bengal", seats: 5, poly: [[89.05, 27.10], [89.80, 27.05], [89.85, 26.48], [89.10, 26.38], [89.05, 26.65]] },
  { id: "coochbehar", name: "Cooch Behar", region: "North Bengal", seats: 9, poly: [[88.80, 26.62], [89.05, 26.65], [89.85, 26.48], [89.85, 25.90], [89.05, 25.92], [88.80, 26.15]] },
  { id: "uttardinajpur", name: "Uttar Dinajpur", region: "North Bengal", seats: 9, poly: [[87.75, 26.45], [88.00, 26.45], [88.42, 26.22], [88.50, 25.65], [88.10, 25.52], [87.80, 25.55], [87.75, 25.80]] },
  { id: "dakshindinajpur", name: "Dakshin Dinajpur", region: "North Bengal", seats: 6, poly: [[87.80, 25.72], [88.50, 25.72], [88.55, 25.05], [88.05, 25.00], [87.82, 25.05]] },
  { id: "malda", name: "Malda", region: "Central Bengal", seats: 12, poly: [[87.70, 25.52], [88.40, 25.52], [88.45, 24.68], [88.10, 24.52], [87.72, 24.70]] },
  { id: "murshidabad", name: "Murshidabad", region: "Central Bengal", seats: 22, poly: [[87.72, 24.95], [88.42, 24.95], [88.72, 24.35], [88.72, 23.75], [88.35, 23.60], [87.90, 23.75], [87.72, 24.20]] },
  { id: "birbhum", name: "Birbhum", region: "Central Bengal", seats: 11, poly: [[87.10, 24.42], [87.75, 24.42], [87.90, 23.85], [87.85, 23.50], [87.35, 23.50], [87.10, 23.80]] },
  { id: "nadia", name: "Nadia", region: "Central Bengal", seats: 17, poly: [[88.05, 24.18], [88.75, 24.05], [89.02, 23.82], [89.02, 23.12], [88.52, 23.05], [88.08, 23.10], [87.92, 23.60], [88.05, 24.00]] },
  { id: "purbabardhaman", name: "Purba Bardhaman", region: "Central Bengal", seats: 16, poly: [[87.28, 23.92], [88.05, 23.92], [88.05, 23.12], [87.55, 23.02], [87.25, 23.25], [87.18, 23.55]] },
  { id: "paschimbardhaman", name: "Paschim Bardhaman", region: "Central Bengal", seats: 9, poly: [[86.72, 23.72], [87.28, 23.92], [87.25, 23.25], [87.15, 22.92], [86.75, 23.02], [86.72, 23.40]] },
  { id: "bankura", name: "Bankura", region: "South-West", seats: 12, poly: [[86.52, 23.52], [87.28, 23.52], [87.28, 22.72], [87.02, 22.52], [86.62, 22.62], [86.42, 23.05]] },
  { id: "purulia", name: "Purulia", region: "South-West", seats: 9, poly: [[85.80, 23.82], [86.72, 23.82], [87.05, 23.52], [86.82, 22.92], [86.55, 22.72], [86.02, 22.82], [85.80, 23.25]] },
  { id: "jhargram", name: "Jhargram", region: "South-West", seats: 4, poly: [[86.02, 22.95], [86.82, 22.95], [87.08, 22.52], [87.02, 22.05], [86.72, 21.95], [86.22, 22.05], [86.02, 22.45]] },
  { id: "paschimmedinipur", name: "Paschim Medinipur", region: "South Bengal", seats: 15, poly: [[86.85, 22.82], [87.28, 22.82], [87.75, 22.65], [87.88, 22.10], [87.55, 21.85], [87.05, 22.02], [86.85, 22.35]] },
  { id: "purbamedinipur", name: "Purba Medinipur", region: "South Bengal", seats: 16, poly: [[87.70, 22.65], [88.28, 22.52], [88.35, 22.15], [88.08, 21.72], [87.80, 21.82], [87.55, 22.02], [87.52, 22.45]] },
  { id: "hooghly", name: "Hooghly", region: "South Bengal", seats: 18, poly: [[87.48, 23.28], [88.05, 23.22], [88.22, 22.75], [88.15, 22.48], [87.88, 22.42], [87.55, 22.62], [87.30, 22.95], [87.30, 23.05]] },
  { id: "howrah", name: "Howrah", region: "South Bengal", seats: 14, poly: [[87.82, 22.85], [88.20, 22.75], [88.40, 22.55], [88.32, 22.28], [88.12, 22.20], [87.90, 22.30], [87.82, 22.52]] },
  { id: "kolkata", name: "Kolkata", region: "South Bengal", seats: 11, poly: [[88.28, 22.80], [88.48, 22.80], [88.48, 22.45], [88.28, 22.45]] },
  { id: "north24parganas", name: "North 24 Parganas", region: "South Bengal", seats: 30, poly: [[88.15, 23.35], [88.80, 23.32], [89.08, 22.72], [88.72, 22.52], [88.50, 22.52], [88.48, 22.80], [88.28, 22.80], [88.18, 22.90]] },
  { id: "south24parganas", name: "South 24 Parganas", region: "South Bengal", seats: 31, poly: [[87.88, 22.42], [88.15, 22.30], [88.28, 22.45], [88.48, 22.45], [88.72, 22.42], [89.08, 22.55], [89.10, 22.02], [89.02, 21.52], [88.00, 21.52], [87.82, 21.80], [87.70, 22.02], [87.80, 22.22]] }
];

// Constituency names per district (official WB 2021 Assembly Election constituencies)
const AC_NAMES = {
  darjeeling:       ["Darjeeling", "Kurseong", "Matigara-Naxalbari", "Siliguri", "Phansidewa", "Chopra", "Islampur"],
  kalimpong:        ["Kalimpong", "Pedong", "Gorubathan"],
  jalpaiguri:       ["Mal", "Nagrakata", "Dhupguri", "Mainaguri", "Jalpaiguri", "Rajganj", "Dabgram-Fulbari", "Maynaguri"],
  alipurduar:       ["Madarihat", "Alipurduar", "Falakata", "Kalchini", "Kumargram"],
  coochbehar:       ["Sitalkuchi", "Sitai", "Dinhata", "Natabari", "Cooch Behar North", "Cooch Behar South", "Mathabhanga", "Mekhliganj", "Tufanganj"],
  uttardinajpur:    ["Goalpokhar", "Chakulia", "Karandighi", "Hemtabad", "Kaliaganj", "Itahar", "Raiganj", "Dalkhola", "Islampur II"],
  dakshindinajpur:  ["Gangarampur", "Kushmandi", "Kumarganj", "Balurghat", "Tapan", "Hili"],
  malda:            ["Habibpur", "Gazole", "Chanchal", "Harischandrapur", "Manikchak", "English Bazar", "Mothabari", "Sujapur", "Baishnabnagar", "Old Malda", "Kaliachak", "Ratua"],
  murshidabad:      ["Farakka", "Samserganj", "Suti", "Jangipur", "Raghunathganj", "Sagardighi", "Lalgola", "Bhagwangola", "Raninagar", "Murshidabad", "Nabagram", "Khargram", "Berhampore", "Hariharpara", "Nowda", "Kandi", "Burwan", "Bharatpur", "Rejinagar", "Beldanga", "Domkal", "Jalangi"],
  birbhum:          ["Nalhati", "Murarai", "Mayureswar", "Rampurhat", "Mohammad Bazar", "Dubrajpur", "Suri", "Bolpur", "Nanoor", "Labpur", "Sainthia"],
  nadia:            ["Karimpur", "Tehatta", "Palashipara", "Krishnanagar North", "Nakashipara", "Chapra", "Krishnanagar South", "Shantipur", "Ranaghat North West", "Ranaghat North East", "Ranaghat South", "Chakdah", "Haringhata", "Kalyani", "Birnagar", "Bagda", "Hanskhali"],
  purbabardhaman:   ["Kalna", "Memari", "Purbasthali North", "Purbasthali South", "Jamalpur", "Monteswar", "Burdwan North", "Burdwan South", "Raina", "Ausgram", "Galsi", "Bhatar", "Ketugram", "Mangolkote", "Khandaghosh", "Katwa"],
  paschimbardhaman: ["Raniganj", "Jamuria", "Asansol North", "Asansol South", "Kulti", "Barabani", "Salanpur", "Pandabeswar", "Durgapur West"],
  bankura:          ["Bankura", "Barjora", "Onda", "Bishnupur", "Kotulpur", "Indas", "Patrasayer", "Sonamukhi", "Saltora", "Chhatna", "Ranibandh", "Raipur"],
  purulia:          ["Bagmundi", "Balarampur", "Puncha", "Manbazar", "Kashipur", "Para", "Jhalda", "Purulia", "Manbajar II"],
  jhargram:         ["Jhargram", "Binpur", "Bandwan", "Gopiballavpur"],
  paschimmedinipur: ["Ghatal", "Chandrakona", "Keshpur", "Garbeta", "Salboni", "Debra", "Medinipur", "Narayangarh", "Pingla", "Sabang", "Dantan", "Nayagram", "Kharagpur Sadar", "Midnapore Town", "Kharagpur"],
  purbamedinipur:   ["Ramnagar", "Contai North", "Contai South", "Deshopriyo Nagar", "Nandigram", "Mahishadal", "Haldia", "Nandakumar", "Tamluk", "Kolaghat", "Mecheda", "Panskura East", "Panskura West", "Moyna", "Chandipur", "Bhagabanpur"],
  hooghly:          ["Arambag", "Goghat", "Khanakul", "Dhaniakhali", "Tarakeswar", "Pursura", "Haripal", "Dhanekhali", "Chanditala", "Singur", "Uttarpara", "Sreerampur", "Chandannagore", "Champdani", "Bhadreswar", "Rishra", "Serampore", "Konnagar"],
  howrah:           ["Uluberia North", "Uluberia South", "Shyampur", "Bagnan", "Amta", "Udaynarayanpur", "Jagatballavpur", "Domjur", "Panchla", "Sankrail", "Howrah North", "Howrah Central", "Howrah South", "Shibpur"],
  kolkata:          ["Chowringhee", "Bhowanipore", "Rashbehari", "Ballygunge", "Kolkata Port", "Kasba", "Entally", "Beleghata", "Jorasanko", "Shyampukur", "Maniktala"],
  north24parganas:  ["Swarupnagar", "Baduria", "Basirhat North", "Basirhat South", "Haroa", "Minakhan", "Sandeshkhali", "Bongaon", "Gaighata", "Bangaon South", "Barasat", "Deganga", "Rajarhat-Gopalpur", "Madhyamgram", "Bidhannagar", "Rajarhat New Town", "Dum Dum North", "Dum Dum", "Panihati", "Kamarhati", "Baranagar", "Khardah", "Belgharia", "Noapara", "Habra", "Amdanga", "Ashokenagar", "Birati", "Taki", "Bagda"],
  south24parganas:  ["Canning East", "Canning West", "Basanti", "Kultali", "Patharpratima", "Kakdwip", "Sagar", "Mathurapur", "Joynagar", "Baruipur West", "Baruipur East", "Sonarpur North", "Sonarpur South", "Budge Budge", "Magrahat West", "Magrahat East", "Diamond Harbour", "Falta", "Satgachia", "Bishnupur", "Bhangar", "Usthi", "Mandirbazar", "Kulpi", "Raidighi", "Jaipur", "Jayanta", "Jaynagar", "Kakdwip South", "Namkhana", "Gosaba"]
};

// Seat fractions based on actual 2021 WB Assembly election results
const DIST_WEIGHTS = {
  darjeeling:       { BJP: 0.571, TMC: 0.429 },            // BJP 4, TMC 3
  kalimpong:        { BJP: 0.667, TMC: 0.333 },            // BJP 2, TMC 1
  jalpaiguri:       { TMC: 0.625, BJP: 0.375 },            // TMC 5, BJP 3
  alipurduar:       { BJP: 0.600, TMC: 0.400 },            // BJP 3, TMC 2
  coochbehar:       { TMC: 0.556, BJP: 0.444 },            // TMC 5, BJP 4
  uttardinajpur:    { TMC: 0.778, BJP: 0.222 },            // TMC 7, BJP 2
  dakshindinajpur:  { TMC: 0.667, BJP: 0.333 },            // TMC 4, BJP 2
  malda:            { TMC: 0.667, INC: 0.167, BJP: 0.167 },// TMC 8, INC 2, BJP 2
  murshidabad:      { TMC: 0.818, ISF: 0.091, BJP: 0.091 },// TMC 18, ISF 2, BJP 2
  birbhum:          { TMC: 1.000 },                        // TMC 11 (swept)
  nadia:            { TMC: 0.647, BJP: 0.353 },            // TMC 11, BJP 6
  purbabardhaman:   { TMC: 0.938, BJP: 0.063 },            // TMC 15, BJP 1
  paschimbardhaman: { TMC: 0.667, BJP: 0.333 },            // TMC 6, BJP 3
  bankura:          { TMC: 0.583, BJP: 0.417 },            // TMC 7, BJP 5
  purulia:          { BJP: 0.667, TMC: 0.333 },            // BJP 6, TMC 3
  jhargram:         { TMC: 0.750, BJP: 0.250 },            // TMC 3, BJP 1
  paschimmedinipur: { BJP: 0.533, TMC: 0.467 },            // BJP 8, TMC 7
  purbamedinipur:   { TMC: 0.688, BJP: 0.313 },            // TMC 11, BJP 5
  hooghly:          { TMC: 0.778, BJP: 0.222 },            // TMC 14, BJP 4
  howrah:           { TMC: 1.000 },                        // TMC 14 (swept)
  kolkata:          { TMC: 1.000 },                        // TMC 11 (swept)
  north24parganas:  { TMC: 0.933, BJP: 0.067 },            // TMC 28, BJP 2
  south24parganas:  { TMC: 1.000 }                         // TMC 31 (swept)
};

const FIRST = ["Amit", "Mamata", "Suvendu", "Rajib", "Firhad", "Madan", "Babul", "Partha", "Sougata", "Tapas", "Mukul", "Dilip", "Locket", "Bratya", "Sandip", "Rekha", "Arjun", "Chandrima", "Adhir", "Minakshi"];
const LAST = ["Banerjee", "Ghosh", "Roy", "Das", "Sen", "Mukherjee", "Chatterjee", "Bose", "Dutta", "Sarkar", "Biswas", "Mondal", "Adhikari", "Saha", "Rahman", "Mandal", "Gupta", "Nandi"];
const ORDER = ["TMC", "BJP", "CPIM", "INC", "ISF"];
const REGIONS = ["North Bengal", "Central Bengal", "South-West", "South Bengal"];

const state = {
  view: "ac",
  selectedType: null,
  selectedId: null,
  eci: null,
  eciReady: false,
  openDistricts: new Set(),
  ticks: [
    "Counting begins across <b>294 constituencies</b> in West Bengal",
    "Early trends: <b>TMC</b> strong in South Bengal",
    "<b>BJP</b> ahead in pockets of Darjeeling and Kalimpong",
    "Observers report smooth counting at all centres"
  ]
};

function makeRand(seed) {
  let s = (seed * 1664525 + 1013904223) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967295;
  };
}

function seeded(seed) {
  return makeRand(seed)();
}

function pickName(seed) {
  return `${FIRST[Math.floor(seeded(seed * 3) * FIRST.length)]} ${LAST[Math.floor(seeded(seed * 7) * LAST.length)]}`;
}

function generateRounds(totalRounds, totalVotes, margin, seed) {
  const rand = makeRand(seed);
  const winnerFinal = Math.floor((totalVotes + margin) / 2);
  const loserFinal = totalVotes - winnerFinal;
  const winnerShare = winnerFinal / totalVotes;
  const raw = Array.from({ length: totalRounds }, () => Math.max(900, Math.floor((totalVotes / totalRounds) * (0.58 + rand() * 0.84))));
  const rawSum = raw.reduce((sum, n) => sum + n, 0);
  const rounds = raw.map((size) => {
    const votes = Math.round((size / rawSum) * totalVotes);
    const share = Math.max(0.08, Math.min(0.92, winnerShare + (rand() - 0.5) * 0.34));
    const w = Math.round(votes * share);
    return { w, l: votes - w };
  });
  const sumW = rounds.reduce((sum, round) => sum + round.w, 0);
  const sumL = rounds.reduce((sum, round) => sum + round.l, 0);
  rounds[rounds.length - 1].w += winnerFinal - sumW;
  rounds[rounds.length - 1].l += loserFinal - sumL;
  return rounds;
}

const AC_DATA = [];
let globalAC = 0;

DISTRICTS.forEach((district) => {
  const names = AC_NAMES[district.id] || [];
  const weights = DIST_WEIGHTS[district.id] || { TMC: 0.65, BJP: 0.35 };
  for (let i = 0; i < district.seats; i++) {
    globalAC += 1;
    const seed = globalAC * 31 + i * 19;
    const rand = makeRand(seed * 13);
    let threshold = seeded(seed);
    let cumulative = 0;
    let winner = "TMC";
    Object.entries(weights).some(([party, weight]) => {
      cumulative += weight;
      if (threshold <= cumulative) {
        winner = party;
        return true;
      }
      return false;
    });
    const loserParty = winner === "TMC" ? "BJP" : "TMC";
    const totalRounds = 20 + Math.floor(rand() * 8);
    const totalVotes = 130000 + Math.floor(rand() * 100000);
    const margin = Math.floor(rand() * 60000) + 2000;
    const rounds = generateRounds(totalRounds, totalVotes, margin, seed * 97);
    const ac = {
      id: globalAC,
      distId: district.id,
      name: names[i] || `${district.name} ${i + 1}`,
      winner,
      loserParty,
      winnerCand: pickName(seed * 3),
      loserCand: pickName(seed * 13),
      totalRounds,
      currentRound: 0,
      totalVotes,
      margin,
      votesW: 0,
      votesL: 0,
      rounds,
      won: false,
      point: null
    };
    const start = seeded(ac.id * 41 + 7);
    if (start < 0.12) {
      ac.currentRound = ac.totalRounds;
      ac.won = true;
    } else if (start < 0.57) {
      ac.currentRound = 1 + Math.floor(seeded(ac.id * 7 + 3) * (ac.totalRounds - 2));
    }
    for (let round = 0; round < ac.currentRound; round++) {
      ac.votesW += ac.rounds[round].w;
      ac.votesL += ac.rounds[round].l;
    }
    AC_DATA.push(ac);
  }
});

const acById = Object.fromEntries(AC_DATA.map((ac) => [ac.id, ac]));
const distById = Object.fromEntries(DISTRICTS.map((district) => [district.id, district]));
const acByDist = AC_DATA.reduce((map, ac) => {
  if (!map[ac.distId]) map[ac.distId] = [];
  map[ac.distId].push(ac);
  return map;
}, {});

function acLeader(ac) {
  if (!ac.currentRound) return null;
  return ac.votesW >= ac.votesL ? ac.winner : ac.loserParty;
}

function acLead(ac) {
  return Math.abs(ac.votesW - ac.votesL);
}

function acProgress(ac) {
  return ac.currentRound / ac.totalRounds;
}

function partyColor(party) {
  return PARTIES[party]?.color || "#68738a";
}

function withAlpha(hex, alpha) {
  const value = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${hex}${value}`;
}

function acColor(ac) {
  if (!ac.currentRound) return "#172033";
  const color = partyColor(acLeader(ac));
  if (ac.won) return color;
  return withAlpha(color, 0.34 + acProgress(ac) * 0.52);
}

function distLeader(distId) {
  const totals = {};
  (acByDist[distId] || []).forEach((ac) => {
    const leader = acLeader(ac);
    if (leader) totals[leader] = (totals[leader] || 0) + 1;
  });
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function countingStats() {
  return AC_DATA.reduce((stats, ac) => {
    if (ac.won) stats.declared += 1;
    else if (ac.currentRound) stats.counting += 1;
    else stats.pending += 1;
    return stats;
  }, { declared: 0, counting: 0, pending: 0 });
}

function computeTotals() {
  const won = {};
  const leading = {};
  AC_DATA.forEach((ac) => {
    const leader = acLeader(ac);
    if (!leader) return;
    const bucket = ac.won ? won : leading;
    bucket[leader] = (bucket[leader] || 0) + 1;
  });
  return { won, leading };
}

function districtStats(distId) {
  const acs = acByDist[distId] || [];
  const declared = acs.filter((ac) => ac.won).length;
  const started = acs.filter((ac) => ac.currentRound > 0).length;
  const roundTotal = acs.reduce((sum, ac) => sum + ac.totalRounds, 0);
  const roundDone = acs.reduce((sum, ac) => sum + ac.currentRound, 0);
  return {
    declared,
    started,
    progress: roundTotal ? roundDone / roundTotal : 0,
    allDone: declared === acs.length,
    anyStarted: started > 0
  };
}

const bounds = DISTRICTS.flatMap((district) => district.poly).reduce((box, [lng, lat]) => ({
  minLng: Math.min(box.minLng, lng),
  maxLng: Math.max(box.maxLng, lng),
  minLat: Math.min(box.minLat, lat),
  maxLat: Math.max(box.maxLat, lat)
}), { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity });

function createProjector(width, height) {
  const pad = width < 640 ? 34 : 34;
  const xScale = (width - pad * 2) / (bounds.maxLng - bounds.minLng);
  const yScale = (height - pad * 2) / (bounds.maxLat - bounds.minLat);
  const scale = Math.min(xScale, yScale);
  const mapW = (bounds.maxLng - bounds.minLng) * scale;
  const mapH = (bounds.maxLat - bounds.minLat) * scale;
  const ox = (width - mapW) / 2;
  const oy = (height - mapH) / 2;
  return ([lng, lat]) => [
    ox + (lng - bounds.minLng) * scale,
    oy + (bounds.maxLat - lat) * scale
  ];
}

function centroid(points) {
  const sum = points.reduce((acc, point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
  return [sum[0] / points.length, sum[1] / points.length];
}

function polygonPath(points) {
  return `M${points.map((point) => point.join(",")).join("L")}Z`;
}

function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function pointsInPoly(count, poly, seed) {
  const rand = makeRand(seed);
  const xs = poly.map((point) => point[0]);
  const ys = poly.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const points = [];
  for (let tries = 0; tries < 9000 && points.length < count; tries++) {
    const x = minX + rand() * (maxX - minX);
    const y = minY + rand() * (maxY - minY);
    if (pointInPoly(x, y, poly)) points.push([x, y]);
  }
  const [cx, cy] = centroid(poly);
  while (points.length < count) {
    const angle = (points.length / count) * Math.PI * 2;
    points.push([cx + Math.cos(angle) * 8, cy + Math.sin(angle) * 8]);
  }
  return points;
}

function voronoiCell(point, points, boundsBox) {
  let poly = [
    [boundsBox[0], boundsBox[1]],
    [boundsBox[2], boundsBox[1]],
    [boundsBox[2], boundsBox[3]],
    [boundsBox[0], boundsBox[3]]
  ];
  points.forEach((other) => {
    if (other === point) return;
    const midX = (point[0] + other[0]) / 2;
    const midY = (point[1] + other[1]) / 2;
    const dx = other[0] - point[0];
    const dy = other[1] - point[1];
    const keep = (candidate) => (candidate[0] - midX) * dx + (candidate[1] - midY) * dy <= 0.0001;
    const next = [];
    for (let i = 0; i < poly.length; i++) {
      const current = poly[i];
      const previous = poly[(i + poly.length - 1) % poly.length];
      const currentIn = keep(current);
      const previousIn = keep(previous);
      if (currentIn !== previousIn) {
        const vx = current[0] - previous[0];
        const vy = current[1] - previous[1];
        const denom = vx * dx + vy * dy;
        if (Math.abs(denom) > 0.00001) {
          const t = ((midX - previous[0]) * dx + (midY - previous[1]) * dy) / denom;
          next.push([previous[0] + vx * t, previous[1] + vy * t]);
        }
      }
      if (currentIn) next.push(current);
    }
    poly = next;
  });
  return poly;
}

function shortDistrict(name) {
  return {
    "North 24 Parganas": "N 24 Pgs",
    "South 24 Parganas": "S 24 Pgs",
    "Purba Bardhaman": "P Bardhaman",
    "Paschim Bardhaman": "W Bardhaman",
    "Paschim Medinipur": "W Medinipur",
    "Purba Medinipur": "E Medinipur",
    "Uttar Dinajpur": "U Dinajpur",
    "Dakshin Dinajpur": "D Dinajpur"
  }[name] || name;
}

function renderMap() {
  const svg = document.getElementById("map-svg");
  const rect = svg.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(300, Math.floor(rect.height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";
  const project = createProjector(width, height);
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs);

  DISTRICTS.forEach((district) => {
    const screenPoly = district.poly.map(project);
    const clipId = `clip-${district.id}`;
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", clipId);
    const clipShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    clipShape.setAttribute("d", polygonPath(screenPoly));
    clipPath.appendChild(clipShape);
    defs.appendChild(clipPath);

    const acs = acByDist[district.id] || [];
    if (state.view === "ac") {
      const points = pointsInPoly(acs.length, screenPoly, district.seats * 113 + district.id.length);
      const xs = screenPoly.map((point) => point[0]);
      const ys = screenPoly.map((point) => point[1]);
      const box = [Math.min(...xs) - 2, Math.min(...ys) - 2, Math.max(...xs) + 2, Math.max(...ys) + 2];
      points.forEach((point, index) => {
        const ac = acs[index];
        if (!ac) return;
        ac.point = point;
        const cell = voronoiCell(point, points, box);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", polygonPath(cell));
        path.setAttribute("class", `ac-cell ${state.selectedType === "ac" && state.selectedId === ac.id ? "selected-map" : ""}`);
        path.setAttribute("fill", acColor(ac));
        path.setAttribute("stroke", "#08111d");
        path.setAttribute("stroke-width", "0.55");
        path.setAttribute("clip-path", `url(#${clipId})`);
        path.addEventListener("click", () => selectAC(ac.id));
        svg.appendChild(path);
      });
    } else {
      const leader = distLeader(district.id);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", polygonPath(screenPoly));
      path.setAttribute("class", `district-shape ${state.selectedType === "dist" && state.selectedId === district.id ? "selected-map" : ""}`);
      path.setAttribute("fill", leader ? partyColor(leader) : "#172033");
      path.setAttribute("stroke", "#08111d");
      path.setAttribute("stroke-width", "0.7");
      path.addEventListener("click", () => selectDistrict(district.id));
      svg.appendChild(path);
    }
  });

  DISTRICTS.forEach((district) => {
    const screenPoly = district.poly.map(project);
    const border = document.createElementNS("http://www.w3.org/2000/svg", "path");
    border.setAttribute("class", "district-border");
    border.setAttribute("d", polygonPath(screenPoly));
    svg.appendChild(border);
    if (district.seats >= 7) {
      const [x, y] = centroid(screenPoly);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("class", "district-label");
      label.setAttribute("x", x);
      label.setAttribute("y", y);
      label.textContent = shortDistrict(district.name);
      svg.appendChild(label);
    }
  });
}

function renderSidebar() {
  if (state.eci?.configured && !state.eci.parties?.length) {
    document.getElementById("cnt-declared").textContent = "0";
    document.getElementById("cnt-counting").textContent = "0";
    document.getElementById("cnt-pending").textContent = "294";
    document.getElementById("mobile-declared").textContent = "0";
    document.getElementById("mobile-counting").textContent = "0";
    document.getElementById("mobile-pending").textContent = "294";
    document.getElementById("overall-fill").style.width = "0%";
    document.getElementById("round-copy").textContent = state.eci.error ? `ECI error: ${state.eci.error}` : "Waiting for official ECI data";
    document.getElementById("seats-bar").innerHTML = "";
    document.getElementById("party-stats").innerHTML = `
      <div class="detail-empty">
        Official ECI source is configured, but no party table was available yet.
      </div>
    `;
    return;
  }

  if (state.eci?.configured && state.eci.parties?.length) {
    const totalSeats = state.eci.parties.reduce((sum, row) => sum + (row.total || 0), 0) || 294;
    const declared = state.eci.parties.reduce((sum, row) => sum + (row.won || 0), 0);
    const leading = state.eci.parties.reduce((sum, row) => sum + (row.leading || 0), 0);
    const pending = Math.max(0, totalSeats - declared - leading);

    document.getElementById("cnt-declared").textContent = declared;
    document.getElementById("cnt-counting").textContent = leading;
    document.getElementById("cnt-pending").textContent = pending;
    document.getElementById("mobile-declared").textContent = declared;
    document.getElementById("mobile-counting").textContent = leading;
    document.getElementById("mobile-pending").textContent = pending;
    document.getElementById("overall-fill").style.width = `${(declared / totalSeats * 100).toFixed(1)}%`;
    document.getElementById("round-copy").textContent = state.eci.lastUpdated || "Official ECI data";

    const seatsBar = document.getElementById("seats-bar");
    seatsBar.innerHTML = "";
    state.eci.parties.forEach((row, index) => {
      if (!row.total) return;
      const party = row.party;
      const seg = document.createElement("div");
      seg.className = "bar-seg";
      seg.style.width = `${(row.total / totalSeats * 100).toFixed(2)}%`;
      seg.style.background = partyColor(party) || ["#00b44f", "#ff6a00", "#1565c0", "#cc1111", "#7b1fa2"][index % 5];
      seg.textContent = row.total >= 10 ? row.total : "";
      seatsBar.appendChild(seg);
    });

    const partyStats = document.getElementById("party-stats");
    partyStats.innerHTML = "";
    state.eci.parties.forEach((row, index) => {
      const color = partyColor(row.party) || ["#00b44f", "#ff6a00", "#1565c0", "#cc1111", "#7b1fa2"][index % 5];
      const el = document.createElement("div");
      el.className = "party-row";
      el.innerHTML = `
        <span class="party-dot" style="background:${color}"></span>
        <span class="party-name"><strong>${row.party}</strong><small>${row.name}</small></span>
        <span class="party-score" style="color:${color}">${row.total}<small>${row.won}W + ${row.leading}L</small></span>
      `;
      partyStats.appendChild(el);
    });
    return;
  }

  const stats = countingStats();
  ["declared", "counting", "pending"].forEach((key) => {
    document.getElementById(`cnt-${key}`).textContent = stats[key];
    document.getElementById(`mobile-${key}`).textContent = stats[key];
  });
  document.getElementById("overall-fill").style.width = `${(stats.declared / 294 * 100).toFixed(1)}%`;

  const { won, leading } = computeTotals();
  const seatsBar = document.getElementById("seats-bar");
  seatsBar.innerHTML = "";
  ORDER.forEach((party) => {
    const seats = (won[party] || 0) + (leading[party] || 0);
    if (!seats) return;
    const seg = document.createElement("div");
    seg.className = "bar-seg";
    seg.style.width = `${(seats / 294 * 100).toFixed(2)}%`;
    seg.style.background = partyColor(party);
    seg.textContent = seats >= 10 ? seats : "";
    seatsBar.appendChild(seg);
  });

  const partyStats = document.getElementById("party-stats");
  partyStats.innerHTML = "";
  ORDER.forEach((party) => {
    const w = won[party] || 0;
    const l = leading[party] || 0;
    const row = document.createElement("div");
    row.className = "party-row";
    row.innerHTML = `
      <span class="party-dot" style="background:${partyColor(party)}"></span>
      <span class="party-name"><strong>${party}</strong><small>${PARTIES[party].full}</small></span>
      <span class="party-score" style="color:${partyColor(party)}">${w + l}<small>${w}W + ${l}L</small></span>
    `;
    partyStats.appendChild(row);
  });
}

function districtStatusClass(stats) {
  if (stats.allDone) return "done";
  if (stats.anyStarted) return "live";
  return "wait";
}

function renderDistricts() {
  const list = document.getElementById("district-list");
  list.innerHTML = "";
  REGIONS.forEach((region) => {
    const districts = DISTRICTS.filter((district) => district.region === region);
    const label = document.createElement("div");
    label.className = "region-label";
    label.textContent = region;
    list.appendChild(label);
    districts.forEach((district) => {
      const acs = acByDist[district.id] || [];
      const leader = distLeader(district.id);
      const stats = districtStats(district.id);
      const status = districtStatusClass(stats);
      const card = document.createElement("article");
      card.className = `district-card ${state.openDistricts.has(district.id) ? "open" : ""} ${state.selectedType === "dist" && state.selectedId === district.id ? "selected" : ""}`;
      card.dataset.distId = district.id;
      card.innerHTML = `
        <button class="district-header" type="button">
          <span class="district-dot" style="background:${leader ? withAlpha(partyColor(leader), stats.allDone ? 1 : 0.65) : "#26324a"}"></span>
          <span class="district-title"><strong>${district.name}</strong><small>${leader ? `${leader} leading` : "Awaited"}</small></span>
          <span class="district-meta">${stats.declared}/${district.seats}</span>
          <span class="status ${status}">${status === "done" ? "DONE" : status === "live" ? "LIVE" : "AWAIT"}</span>
        </button>
        <div class="district-progress"><div style="width:${(stats.progress * 100).toFixed(1)}%;background:${leader ? withAlpha(partyColor(leader), 0.72) : "#26324a"}"></div></div>
        <div class="ac-list"></div>
      `;
      card.querySelector(".district-header").addEventListener("click", () => {
        if (state.openDistricts.has(district.id)) state.openDistricts.delete(district.id);
        else state.openDistricts.add(district.id);
        selectDistrict(district.id, false);
        renderDistricts();
      });
      const acList = card.querySelector(".ac-list");
      acs.forEach((ac) => {
        const leaderNow = acLeader(ac);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `ac-row ${state.selectedType === "ac" && state.selectedId === ac.id ? "selected" : ""}`;
        button.innerHTML = `
          <span class="ac-dot" style="background:${leaderNow ? withAlpha(partyColor(leaderNow), ac.won ? 1 : 0.65) : "#26324a"}"></span>
          <span class="ac-name">${ac.name}</span>
          <span class="ac-round">${ac.currentRound ? `R${ac.currentRound}/${ac.totalRounds}` : "Awaited"}</span>
          <span class="ac-party" style="color:${leaderNow ? partyColor(leaderNow) : "#7f8ca7"}">${leaderNow || "--"}</span>
        `;
        button.addEventListener("click", () => selectAC(ac.id));
        acList.appendChild(button);
      });
      list.appendChild(card);
    });
  });
}

function renderDetail() {
  const title = document.getElementById("detail-title");
  const body = document.getElementById("detail-body");
  const selectedCopy = document.getElementById("selected-copy");
  if (state.selectedType === "ac") {
    const ac = acById[state.selectedId];
    const district = distById[ac.distId];
    const leader = acLeader(ac);
    const color = leader ? partyColor(leader) : "#7f8ca7";
    title.textContent = ac.name;
    selectedCopy.textContent = `${ac.name}, ${district.name}`;
    body.className = "detail-body";
    body.innerHTML = `
      <div style="color:${color};font-weight:900">${leader ? `${leader} ${ac.won ? "won" : "leading"}` : "Counting awaited"}</div>
      <div>${district.name} · ${district.region}</div>
      <div class="detail-grid">
        <div class="detail-chip"><strong>${ac.currentRound}/${ac.totalRounds}</strong><span>Rounds counted</span></div>
        <div class="detail-chip"><strong>${leader ? acLead(ac).toLocaleString() : "0"}</strong><span>Current lead</span></div>
        <div class="detail-chip"><strong>${ac.votesW.toLocaleString()}</strong><span>${ac.winnerCand}</span></div>
        <div class="detail-chip"><strong>${ac.votesL.toLocaleString()}</strong><span>${ac.loserCand}</span></div>
      </div>
    `;
  } else if (state.selectedType === "dist") {
    const district = distById[state.selectedId];
    const stats = districtStats(district.id);
    const leader = distLeader(district.id);
    title.textContent = district.name;
    selectedCopy.textContent = `${district.name}: ${stats.declared}/${district.seats} declared`;
    body.className = "detail-body";
    body.innerHTML = `
      <div style="color:${leader ? partyColor(leader) : "#7f8ca7"};font-weight:900">${leader ? `${leader} ahead in district trends` : "Counting awaited"}</div>
      <div>${district.region} · ${district.seats} seats</div>
      <div class="detail-grid">
        <div class="detail-chip"><strong>${stats.declared}</strong><span>Declared</span></div>
        <div class="detail-chip"><strong>${stats.started}</strong><span>Started</span></div>
      </div>
    `;
  } else {
    title.textContent = "No seat selected";
    selectedCopy.textContent = "Tap a seat or district for details";
    body.className = "detail-empty";
    body.textContent = "Choose an area on the map or in the district list.";
  }
}

function renderTicker() {
  const items = [...state.ticks, ...state.ticks];
  document.getElementById("ticker-inner").innerHTML = items.map((item) => `<span>${item}</span>`).join("");
}

function renderAll() {
  renderMap();
  renderSidebar();
  renderDistricts();
  renderDetail();
  renderTicker();
}

function selectAC(id) {
  const ac = acById[id];
  if (!ac) return;
  state.selectedType = "ac";
  state.selectedId = id;
  state.openDistricts.add(ac.distId);
  renderMap();
  renderDistricts();
  renderDetail();
}

function selectDistrict(id, rerenderMap = true) {
  state.selectedType = "dist";
  state.selectedId = id;
  if (rerenderMap) renderMap();
  renderDistricts();
  renderDetail();
}

function addTick(message) {
  state.ticks.unshift(message);
  if (state.ticks.length > 20) state.ticks.pop();
  renderTicker();
}

async function fetchEciData() {
  try {
    const response = await fetch("/api/results", { cache: "no-store" });
    const data = await response.json();
    state.eci = data;
    if (data.configured && data.parties?.length) {
      state.eciReady = true;
      const src = data.source === "results.json" ? "local results file" : "results.eci.gov.in";
      state.ticks = [
        `Live results loaded from <b>${src}</b>`,
        data.lastUpdated || new Date().toLocaleString("en-IN")
      ];
    } else if (data.configured) {
      state.ticks = ["Source configured — waiting for results data"];
    } else {
      document.getElementById("round-copy").textContent = "Simulation mode — no live source";
    }
  } catch (error) {
    state.eci = { configured: false, error: error.message };
    document.getElementById("round-copy").textContent = "Cannot reach server";
  }
  renderSidebar();
  renderTicker();
}

function liveUpdate() {
  if (state.eciReady) return;
  const notStarted = AC_DATA.filter((ac) => ac.currentRound === 0);
  const inProgress = AC_DATA.filter((ac) => ac.currentRound > 0 && !ac.won);
  const chosen = new Set();
  notStarted.sort(() => Math.random() - 0.5).slice(0, 2).forEach((ac) => chosen.add(ac));
  inProgress.sort((a, b) => acProgress(b) - acProgress(a)).slice(0, 5).forEach((ac) => chosen.add(ac));
  if (inProgress.length) chosen.add(inProgress[Math.floor(Math.random() * inProgress.length)]);

  let focus = null;
  chosen.forEach((ac) => {
    if (ac.currentRound >= ac.totalRounds) return;
    const round = ac.rounds[ac.currentRound];
    ac.currentRound += 1;
    ac.votesW += round.w;
    ac.votesL += round.l;
    const leader = acLeader(ac);
    if (ac.currentRound === ac.totalRounds) {
      ac.won = true;
      focus = focus || ac;
      addTick(`<b>${ac.name}</b> declared: <b>${leader}</b> wins by ${acLead(ac).toLocaleString()}`);
    } else if (!focus || acLead(ac) < acLead(focus)) {
      focus = ac;
    }
  });

  if (focus) {
    state.openDistricts.add(focus.distId);
    if (!state.selectedType) {
      state.selectedType = "ac";
      state.selectedId = focus.id;
    }
  }
  renderMap();
  renderSidebar();
  renderDistricts();
  renderDetail();
}

document.querySelectorAll(".seg-btn").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    document.querySelectorAll(".seg-btn").forEach((btn) => btn.classList.toggle("active", btn === button));
    document.getElementById("map-title").textContent = state.view === "ac" ? "Constituency Map" : "District Map";
    renderMap();
  });
});

document.querySelectorAll(".mobile-tab").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    document.querySelectorAll(".mobile-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    document.querySelectorAll("[data-mobile-panel]").forEach((panel) => {
      panel.classList.toggle("active-mobile", panel.dataset.mobilePanel === target);
    });
    requestAnimationFrame(renderMap);
  });
});

document.getElementById("reset-focus").addEventListener("click", () => {
  state.selectedType = null;
  state.selectedId = null;
  renderMap();
  renderDistricts();
  renderDetail();
});

setInterval(() => {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}, 1000);

window.addEventListener("resize", () => requestAnimationFrame(renderMap));

renderAll();
fetchEciData();
setInterval(fetchEciData, 120000);
setInterval(liveUpdate, 8000);
