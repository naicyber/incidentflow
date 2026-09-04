const { Pool } = require("pg");

const pool = new Pool ({
    user: "nai",
    host: "localhost",
    database: "incidentflow",
    port: 5432
});


module.exports = pool;