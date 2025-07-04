//=== Imports ===================================================================================//
import mysql from "mysql2";
import path from "path";

//=== Constants =================================================================================//
const MSG_CONNECTION_SUCCESS = "MySQL pool created successfully.";
const MSG_CONNECTION_FAILED = "Failed to create MySQL pool: ";

//=== Main ======================================================================================//
// DB pool
const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0
});
const db = pool.promise();

// Test connection (once)
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log(MSG_CONNECTION_SUCCESS);
        connection.release();
    } catch (err) {
        console.error(MSG_CONNECTION_FAILED + err.stack);
    }
}
testConnection();

//=== Export ====================================================================================//
export default db;