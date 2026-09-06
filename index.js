const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());
const PORT = 3000;

app.post("/incidents", async (req, res) => {
  console.log(req.body);

  const { title, severity, ip, user } = req.body;

  if (!title || !severity || !ip || !user) {
    return res.status(400).json({
      error: "MISSING_FIELDS"
    });
  }

const normalizedSeverity = severity.toLowerCase();

const allowedSeverities = [
  "low",
  "medium",
  "high",
  "critical"
];

if (!allowedSeverities.includes(normalizedSeverity)) {
  return res.status(400).json({
    error: "INVALID_SEVERITY",
    message: "Severity must be low, medium, high or critical"
  });
}

  try {
    const idResult = await pool.query(
      "SELECT nextval('incidents_id_seq') AS id"
    );

    const nextId = idResult.rows[0].id;
    const formattedNumber = String(nextId).padStart(4, "0");
    const incidentId = `INC-2026-${formattedNumber}`;

    const query = `
      INSERT INTO incidents
      (id, incident_code, title, severity, ip, username)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      nextId,
      incidentId,
      title,
      normalizedSeverity,
      ip,
      user
    ];

    await pool.query(query, values);

    console.log(incidentId);

    return res.status(201).json({
      incidentId: incidentId,
      status: "created",
      severity: normalizedSeverity
    });
  } catch (error) {
    console.error("Failed to create incident:", error.message);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to create incident"
    });
  }
});

app.get("/incidents", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM incidents ORDER BY id ASC"
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch incidents:", error.message);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch incidents"
    });
  }
});

app.get("/incidents/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM incidents WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "INCIDENT_NOT_FOUND"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch incident:", error.message);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch incident"
    });
  }
});

app.listen(PORT, () => {
  console.log("IncidentFlow API running on port 3000");
});