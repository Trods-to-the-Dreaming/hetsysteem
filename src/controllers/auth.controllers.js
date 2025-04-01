const db = require("../utils/db");
const bcrypt = require("bcryptjs");

const MSG_UNEXPECTED_ERROR = "Er is een fout opgetreden.";
const MSG_INVALID_LOGIN = "Ongeldige gebruikersnaam of wachtwoord.";
const MSG_PASSWORD_MISMATCH = "De wachtwoorden komen niet overeen.";
const MSG_USERNAME_TAKEN = "Deze gebruikersnaam is al in gebruik.";
const MSG_CURRENT_PASSWORD_WRONG = "Dit is niet uw huidige wachtwoord.";

const AuthController = {
	//--- Show login page ---//
	showLogin: (req, res) => {
		res.render("auth/login");
	},
	
	//--- Handle login request ---//
	handleLogin: (req, res) => {
		const { username, password } = req.body;

		// Check if username exists
		db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
			if (err) {
				console.log(err);
				return res.send(MSG_UNEXPECTED_ERROR);
			}

			// Username does not exist
			if (results.length === 0) {
				return res.render("auth/login", { login_error: MSG_INVALID_LOGIN });
			}

			// Check password
			const user = results[0];
			bcrypt.compare(password, user.password, (err, match) => {
				if (err) {
					console.log(err);
					return res.send(MSG_UNEXPECTED_ERROR);
				}

				if (match) {
					req.session.username = user.username;
					return res.redirect("/game/menu");
				} else {
					return res.render("auth/login", { login_error: MSG_INVALID_LOGIN });
				}
			});
		});
	},
	
	//--- Show registration page ---//
	showRegister: (req, res) => {
		res.render("auth/register");
	},
	
	//--- Handle registration request ---//
	handleRegister: (req, res) => {
		const { username, password, password_confirm } = req.body;

		if (password !== password_confirm) {
			return res.render("auth/register", { confirmation_error: MSG_PASSWORD_MISMATCH });
		}

		// Check if username already exists
		db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
			if (err) {
				console.log(err);
				return res.send(MSG_UNEXPECTED_ERROR);
			}

			if (results.length > 0) {
				return res.render("auth/register", { username_error: MSG_USERNAME_TAKEN });
			}

			// Hash the password and insert the new user
			bcrypt.hash(password, 8, (err, hashedPassword) => {
				if (err) {
					console.log(err);
					return res.send(MSG_UNEXPECTED_ERROR);
				}

				db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err, result) => {
					if (err) {
						console.log(err);
						return res.send(MSG_UNEXPECTED_ERROR);
					}
					
					req.session.username = username;
					return res.redirect("/game/menu");
				});
			});
		});
	},
	
	//--- Show account page ---//
	showAccount: (req, res) => {
		res.render("auth/account");
	},
	
	/*//--- Show change password page ---//
	showChangePassword: (req, res) => {
		res.render("auth/changepassword");
	},
	
	//--- Handle change password request ---//
	handleChangePassword: (req, res) => {
		const { current_password, new_password, password_confirm } = req.body;

		if (new_password !== password_confirm) {
			return res.render("auth/changepassword", { confirmation_error: MSG_PASSWORD_MISMATCH });
		}

		// Check if username exists
		db.query("SELECT * FROM users WHERE username = ?", [req.session.username], (err, results) => {
			if (err) {
				console.log(err);
				return res.send(MSG_UNEXPECTED_ERROR);
			}

			// Check password
			const user = results[0];
			bcrypt.compare(current_password, user.password, (err, match) => {
				if (err) {
					console.log(err);
					return res.send(MSG_UNEXPECTED_ERROR);
				}

				if (match) {
					// Hash the password and insert the new user
					bcrypt.hash(password, 8, (err, hashedPassword) => {
						if (err) {
							console.log(err);
							return res.send(MSG_UNEXPECTED_ERROR);
						}

						db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err, result) => {
							if (err) {
								console.log(err);
								return res.send(MSG_UNEXPECTED_ERROR);
							}
							
							req.session.username = username;
							return res.redirect("/game/menu");
						});
					});
					
					
					
					
					db.query("UPDATE users SET password = ? WHERE username = ?", [username], (err, results) => {
					if (err) {
						console.log(err);
						return res.send(MSG_UNEXPECTED_ERROR);
					}

					if (results.length > 0) {
						return res.render("auth/register", { message: MSG_USERNAME_TAKEN });
					}

					// Hash the password and insert the new user
					bcrypt.hash(password, 8, (err, hashedPassword) => {
						if (err) {
							console.log(err);
							return res.send(MSG_UNEXPECTED_ERROR);
						}

						db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err, result) => {
							if (err) {
								console.log(err);
								return res.send(MSG_UNEXPECTED_ERROR);
							}
							
							req.session.username = username;
							return res.redirect("/game/menu");
						});
					});
				});
					
					
					
					
					req.session.username = user.username;
					return res.redirect("/game/menu");
				} else {
					return res.render("auth/changepassword", { password_error: MSG_CURRENT_PASSWORD_WRONG });
				}
			});
		});
		
		
		
		
		// Check if username already exists
		
	},*/
	
	//--- Handle logout request ---//
	handleLogout: (req, res) => {
		req.session.destroy((err) => {
			if (err) {
				console.error(err);
				return res.status(500).send(MSG_UNEXPECTED_ERROR);
			}
			res.redirect("/");
		});
	}
};

module.exports = { AuthController };