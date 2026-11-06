const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


let currentDataset = null;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

app.use(express.static(path.join(__dirname, "public")));

const REQUIRED_COLUMNS = [
  "team",
  "player",
  "role",
  "matches",
  "runs",
  "average",
  "strike_rate",
  "wickets"
];

function numberFromCell(value, column, lineNumber, allowBlank = false) {
  const text = String(value ?? "").trim();

  if (allowBlank && text === "") return null;

  const number = Number(text);
  if (!Number.isFinite(number)) {
    throw new Error(`Invalid number in "${column}" on CSV row ${lineNumber}.`);
  }

  return number;
}

function analyzeCsv(buffer) {
  const records = parse(buffer, {
    bom: true,
    columns: headers => headers.map(header => header.trim().toLowerCase()),
    skip_empty_lines: true,
    trim: true,
    relax_column_count: false
  });

  if (!records.length) {
    throw new Error("The CSV file has no data rows.");
  }

  const headers = Object.keys(records[0]);
  const missing = REQUIRED_COLUMNS.filter(column => !headers.includes(column));

  if (missing.length) {
    throw new Error(`Missing required CSV columns: ${missing.join(", ")}.`);
  }

  const teams = {};

  records.forEach((row, index) => {
    const lineNumber = index + 2;
    const teamName = String(row.team || "").trim();
    const playerName = String(row.player || "").trim();

    if (!teamName || !playerName) {
      throw new Error(`Team and player are required on CSV row ${lineNumber}.`);
    }

    const player = {
      name: playerName,
      role: String(row.role || "Unknown").trim(),
      matches: numberFromCell(row.matches, "matches", lineNumber),
      runs: numberFromCell(row.runs, "runs", lineNumber),
      average: numberFromCell(row.average, "average", lineNumber, true) ?? 0,
      strikeRate: numberFromCell(row.strike_rate, "strike_rate", lineNumber, true) ?? 0,
      wickets: numberFromCell(row.wickets, "wickets", lineNumber)
    };

    if (!teams[teamName]) {
      teams[teamName] = {
        name: teamName,
        players: [],
        matches: 0,
        wins: null,
        points: null
      };
    }

    teams[teamName].players.push(player);

  
    const teamMatches = headers.includes("team_matches")
      ? numberFromCell(row.team_matches, "team_matches", lineNumber, true)
      : null;
    const wins = headers.includes("wins")
      ? numberFromCell(row.wins, "wins", lineNumber, true)
      : null;
    const points = headers.includes("points")
      ? numberFromCell(row.points, "points", lineNumber, true)
      : null;

    teams[teamName].matches = Math.max(
      teams[teamName].matches,
      teamMatches ?? player.matches
    );

    if (wins !== null) teams[teamName].wins = wins;
    if (points !== null) teams[teamName].points = points;
  });

  return teams;
}

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Choose a CSV file to upload." });
  }

  try {
    currentDataset = analyzeCsv(req.file.buffer);
    res.json({
      message: "CSV uploaded and analyzed successfully.",
      teams: currentDataset
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Could not read this CSV file." });
  }
});

app.get("/api/data", (req, res) => {
  if (!currentDataset) {
    return res.status(404).json({ error: "Upload a CSV file to view results." });
  }

  res.json({ teams: currentDataset });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "The CSV file must be 5 MB or smaller." });
  }

  res.status(400).json({ error: error.message || "Request could not be completed." });
});

app.listen(PORT, () => {
  console.log(`IPL dashboard running at http://localhost:${PORT}`);
});