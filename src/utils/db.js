const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env")});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + db.threadId);
});

module.exports = db;