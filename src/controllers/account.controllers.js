const ACCOUNT = require("../constants/account");
const db = require("../utils/db");
const bcrypt = require("bcryptjs");

//--- Show account menu page ---//
const showAccountMenu = (req, res) => {
	res.render("account/menu");
};

//--- Show change username page ---//
const showChangeUsername = (req, res) => {
	const changeSuccessful = req.session.changeSuccessful;
	delete req.session.changeSuccessful;
	res.render("account/changeusername", {
		username: req.session.username,
		changeSuccessful: changeSuccessful
	});
};

//--- Handle change username request ---//
const handleChangeUsername = (req, res) => {
	const currentUsername = req.session.username;
	const { newUsername, password } = req.body;

	// Check if new username is available
	db.query("SELECT * FROM users WHERE username = ?", [newUsername], (error, results) => {
		if (error) {
			console.log(error);
			return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
		}

		// Username already exists
		if (results.length > 0) {
			return res.render("account/changeusername", {
				errorUsername: ACCOUNT.USERNAME_TAKEN,
				newUsername: newUsername
			});
		}
		
		// Check password
		db.query("SELECT * FROM users WHERE username = ?", [currentUsername], (error, results) => {
			const user = results[0];
			bcrypt.compare(password, user.password, (error, match) => {
				if (error) {
					console.log(error);
					return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
				}

				if (match) {
					db.query("UPDATE users SET username = ? WHERE username = ?", [newUsername, currentUsername], (error, results) => {
						req.session.username = newUsername;
						req.session.changeSuccessful = ACCOUNT.USERNAME_CHANGED;
						req.session.save((error) => {
							if (error) {
								console.log(error);
								return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
							}
							return res.redirect("/account/changeusername");
						});
					});
				} else {
					return res.render("account/changeusername", {
						errorPassword: ACCOUNT.PASSWORD_WRONG,
						newUsername: newUsername
					});
				}
			});
		});
	});
};

//--- Show change password page ---//
const showChangePassword = (req, res) => {
	const changeSuccessful = req.session.changeSuccessful;
	delete req.session.changeSuccessful;
	res.render("account/changepassword", {
		username: req.session.username,
		changeSuccessful: changeSuccessful
	});
};

//--- Handle change password request ---//
const handleChangePassword = (req, res) => {
	const username = req.session.username;
	const { currentPassword, newPassword, passwordConfirm } = req.body;

	if (newPassword !== passwordConfirm) {
		return res.render("account/changepassword", {
			errorConfirm: ACCOUNT.PASSWORD_MISMATCH
		});
	}

	// Look up user
	db.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
		if (error) {
			console.log(error);
			return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
		}

		// Check password
		const user = results[0];
		bcrypt.compare(currentPassword, user.password, (error, match) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}

			if (match) {
				// Hash the new password and replace the old one
				bcrypt.hash(newPassword, 8, (error, hashedNewPassword) => {
					if (error) {
						console.log(error);
						return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
					}

					db.query("UPDATE users SET password = ? WHERE username = ?", [hashedNewPassword, username], (error, results) => {
						req.session.changeSuccessful = ACCOUNT.PASSWORD_CHANGED;
						req.session.save((error) => {
							if (error) {
								console.log(error);
								return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
							}
							return res.redirect("/account/changepassword");
						});
					});
				});
			} else {
				return res.render("account/changepassword", {
					errorPassword: ACCOUNT.PASSWORD_WRONG
				});
			}
		});
	});	
};

//--- Export ---//
module.exports = {
	showAccountMenu,
	showChangeUsername,
	handleChangeUsername,
	showChangePassword,
	handleChangePassword
};