const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;

let incidentCounter = 1;

app.post("/incidents", (req, res) => {
  console.log(req.body);

  const { title, severity, ip, user } = req.body;

  if (!title || !severity || !ip || !user) {
    return res.status(400).json({
      error: "MISSING_FIELDS"
    });
  }

  const formattedNumber = String(incidentCounter).padStart(4, "0");
  const incidentId = `INC-2026-${formattedNumber}`;

  incidentCounter++;

  console.log(incidentId);

  res.status(201).json({
  incidentId: incidentId,
  status: "created",
  severity: severity
});
});

app.listen(PORT, () => {
  console.log("IncidentFlow API running on port 3000");
});