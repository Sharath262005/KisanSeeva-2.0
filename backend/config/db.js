const { Pool } = require("pg");
require("dotenv").config();

// Shared pool options for stability with Supabase / cloud Postgres
const poolCommon = {
  max: 10,                    // max connections in pool
  idleTimeoutMillis: 30000,   // close idle connections after 30 s
  connectionTimeoutMillis: 5000, // error if a connection takes > 5 s
  keepAlive: true,            // prevent OS from dropping idle TCP connections
  keepAliveInitialDelayMillis: 10000,
};

const pool = new Pool(
  process.env.DB_URL
    ? {
        connectionString: process.env.DB_URL,
        ssl: { rejectUnauthorized: false }, // required for Supabase / cloud providers
        ...poolCommon,
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ...poolCommon,
      }
);

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Thin query wrapper — retries once on connection errors (handles Supabase pool drops)
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // Retry once on connection/pool/DNS errors (not syntax/constraint errors)
    if (
      err.code === "ECONNRESET" ||
      err.code === "ECONNREFUSED" ||
      err.code === "ENOTFOUND" ||
      err.code === "ETIMEDOUT" ||
      err.code === "57P01" || // admin_shutdown
      err.message?.includes("Connection terminated") ||
      err.message?.includes("timeout")
    ) {
      console.warn("[DB] Connection error, retrying once...", err.message);
      try {
        return await pool.query(text, params);
      } catch (retryErr) {
        console.error("[DB] Retry failed:", retryErr.message);
        throw retryErr;
      }
    }
    throw err;
  }
};

module.exports = {
  query,
  pool,
};
