const db = require("../utils/db");
const bcrypt = require("bcryptjs");

const Authentication = {
	showLogin: (req, res) => {
		res.render("login");
	},
	
	handleLogin: (req, res) => {
		const { username, password } = req.body;

		db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
			if (err) {
				console.log(err);
				return res.send("Er is een fout opgetreden.");
			}

			if (results.length === 0) {
				return res.render("login", { message: "Gebruiker niet gevonden." });
			}

			const user = results[0];
			bcrypt.compare(password, user.password, (err, match) => {
				if (err) {
					console.log(err);
					return res.send("Er is een fout opgetreden.");
				}

				if (match) {
					return res.redirect("/test");
				} else {
					return res.render("login", { message: "Ongeldig wachtwoord." });
				}
			});
		});
	},
	
	showTest: (req, res) => {
		res.render("test");
	}
};

module.exports = { Authentication };