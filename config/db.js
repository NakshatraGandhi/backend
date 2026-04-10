const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  idleTimeout: 60000,
  connectTimeout: 10000,
});

// Test connection and auto-fix role column
pool.getConnection((err, connection) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("DB Connected ✅");
    connection.query(
      "ALTER TABLE users MODIFY COLUMN role VARCHAR(50)",
      (err) => {
        if (err) console.log("Column fix note:", err.message);
        else console.log("Role column fixed ✅");
        connection.release();
      }
    );
  }
});

module.exports = pool;