/*const mysql = require("mysql2");
const path = require("path");

const MSG_CONNECTION_SUCCESS = "MySQL pool gecreëerd";
const MSG_CONNECTION_FAILED = "Creëren van MySQL pool mislukt: ";

const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,  // Queue requests if pool is full
    queueLimit: 0  // No limit on waiting requests
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error(MSG_CONNECTION_FAILED + err.stack);
        return;
    }
    console.log(MSG_CONNECTION_SUCCESS);
    connection.release(); // Release initial test connection
});

module.exports = pool;*/

const mysql = require("mysql2");
const path = require("path");

const MSG_CONNECTION_SUCCESS = "MySQL pool created successfully.";
const MSG_CONNECTION_FAILED = "Failed to create MySQL pool: ";

const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0
});

// Wrap the pool with promise-based methods
const db = pool.promise();

// Test the connection
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log(MSG_CONNECTION_SUCCESS);
        connection.release(); // Free up the connection
    } catch (err) {
        console.error(MSG_CONNECTION_FAILED + err.stack);
    }
}

testConnection();

module.exports = db;