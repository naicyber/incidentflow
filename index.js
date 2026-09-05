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
  severity,
  ip,
  user
];

  await pool.query(query, values);

  console.log(incidentId);

  res.status(201).json({
  incidentId: incidentId,
  status: "created",
  severity: severity
});
});

app.get("/incidents", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM incidents ORDER BY id ASC");

    res.status(200).json(result.rows);

});

app.get("/incidents/:id", async (req, res) => {
    const { id } = req.params;
    
    const result = await pool.query(
        "SELECT * FROM incidents WHERE id = $1",
        [id]
    );

    res.status(200).json(result.rows[0]);
    
});

app.listen(PORT, () => {
  console.log("IncidentFlow API running on port 3000");
}); 