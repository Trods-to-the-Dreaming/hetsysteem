const ACCOUNT = require("../constants/account");
const db = require("../utils/db");
const bcrypt = require("bcryptjs");

//--- Show login page ---//
const showLogin = (req, res) => {
	res.render("auth/login");
};

//--- Handle login request ---//
const handleLogin = (req, res) => {
	const { username, password } = req.body;

	// Check if username exists
	db.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
		if (error) {
			console.log(error);
			return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
		}

		// Username does not exist
		if (results.length === 0) {
			return res.render("auth/login", { 
				errorLogin: ACCOUNT.INVALID_LOGIN, 
				username: username
			});
		}

		// Check password
		const user = results[0];
		bcrypt.compare(password, user.password, (error, match) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}

			if (match) {
				req.session.username = user.username;
				req.session.save((error) => {
					if (error) {
						console.log(error);
						return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
					}
					return res.redirect("/game/menu");
				});
			} else {
				return res.render("auth/login", {
					errorLogin: ACCOUNT.INVALID_LOGIN,
					username: username
				});
			}
		});
	});
};

//--- Show registration page ---//
const showRegister = (req, res) => {
	res.render("auth/register");
};

//--- Handle registration request ---//
const handleRegister = (req, res) => {
	const { username, password, passwordConfirm } = req.body;

	if (password !== passwordConfirm) {
		return res.render("auth/register", {
			errorConfirm: ACCOUNT.PASSWORD_MISMATCH,
			username: username
		});
	}

	// Check if username already exists
	db.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
		if (error) {
			console.log(error);
			return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
		}

		if (results.length > 0) {
			return res.render("auth/register", {
				errorUsername: ACCOUNT.USERNAME_TAKEN,
				username: username
			});
		}

		// Hash the password and insert the new user
		bcrypt.hash(password, 8, (error, hashedPassword) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}

			db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (error, result) => {
				if (error) {
					console.log(error);
					return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
				}
				
				req.session.username = username;
				req.session.save((error) => {
					if (error) {
						console.log(error);
						return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
					}
					return res.redirect("/game/menu");
				});
			});
		});
	});
};

//--- Handle logout request ---//
const handleLogout = (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			console.error(error);
			return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
		}
		res.clearCookie("systeem_session_cookie");
		res.redirect("/auth/login");
	});
};

//--- Export ---//
module.exports = {
	showLogin,
	handleLogin,
	showRegister,
	handleRegister,	
	handleLogout
};