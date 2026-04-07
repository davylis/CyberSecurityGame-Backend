const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  console.log("BODY:", req.body);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.post("/api/session", async (req, res) => {
  try {
    const { participantCode, name, degree, ageGroup, agree } = req.body;

    const sessionId = uuidv4();

    await pool.query(
      `
      INSERT INTO sessions (
        session_id,
        participant_code,
        player_name,
        degree,
        age_group,
        agreed_to_research,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        sessionId,
        participantCode || null,
        name || null,
        degree || null,
        ageGroup || null,
        agree === true
      ]
    );

    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/progress", async (req, res) => {
  try {
    const {
      sessionId,
      points,
      currentTask,
      case1Score,
      case2Score,
      case3Score,
      case4Score,
      case5Score,
      case6Score,
      case7Score,
      case8Score,
      case9Score,
      case10Score,
      case11Score,
      case5Choices,
      case6Choices,
      case7Choices,
      case8Choices,
      case9Choices,
      case10Choices,
      case11Choices,
      elapsedSeconds,
      status
    } = req.body;

    const existing = await pool.query(
      `SELECT id FROM sessions WHERE session_id = $1`,
      [sessionId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    await pool.query(
      `
      INSERT INTO progress_logs (
        session_id,
        points,
        current_task,
        case1_score,
        case2_score,
        case3_score,
        case4_score,
        case5_score,
        case6_score,
        case7_score,
        case8_score,
        case9_score,
        case10_score,
        case11_score,
        case5_choices,
        case6_choices,
        case7_choices,
        case8_choices,
        case9_choices,
        case10_choices,
        case11_choices,
        elapsed_seconds,
        status,
        saved_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,$21,
        $22,$23,NOW()
      )
      `,
      [
        sessionId,
        points || 0,
        currentTask || 0,
        case1Score || 0,
        case2Score || 0,
        case3Score || 0,
        case4Score || 0,
        case5Score || 0,
        case6Score || 0,
        case7Score || 0,
        case8Score || 0,
        case9Score || 0,
        case10Score || 0,
        case11Score || 0,
        JSON.stringify(case5Choices || []),
        JSON.stringify(case6Choices || []),
        JSON.stringify(case7Choices || []),
        JSON.stringify(case8Choices || []),
        JSON.stringify(case9Choices || []),
        JSON.stringify(case10Choices || []),
        JSON.stringify(case11Choices || []),
        elapsedSeconds || 0,
        status || "in_progress"
      ]
    );

    await pool.query(
      `
      UPDATE sessions
      SET
        latest_points = $1,
        latest_task = $2,
        latest_status = $3,
        updated_at = NOW(),
        completed_at = CASE WHEN $3 = 'completed' THEN NOW() ELSE completed_at END
      WHERE session_id = $4
      `,
      [
        points || 0,
        currentTask || 0,
        status || "in_progress",
        sessionId
      ]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Save progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});