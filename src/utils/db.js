const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env")});

const MSG_CONNECTION_SUCCESS = "Verbonden met MySQL als ID ";
const MSG_CONNECTION_FAILED = "Verbinden met databank mislukt: ";

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

db.connect((err) => {
	if (err) {
		console.error(MSG_CONNECTION_FAILED + err.stack);
		return;
	}
	console.log(MSG_CONNECTION_SUCCESS + db.threadId);
});

module.exports = db;