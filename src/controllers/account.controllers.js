const ACCOUNT = require("../constants/account");
const db = require("../utils/db");
const bcrypt = require("bcrypt");

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

const handleChangeUsername = async (req, res) => {
	const currentUsername = req.session.username;
	const { newUsername, password } = req.body;

	try {
		// Check if new username already exists
		const [existingUsers] = await db.execute("SELECT * FROM users WHERE username = ?", [newUsername]);
		if (existingUsers.length > 0) {
			return res.render("account/changeusername", {
				errorUsername: ACCOUNT.USERNAME_TAKEN,
				newUsername
			});
		}

		// Get current user data
		const [currentUsers] = await db.execute("SELECT * FROM users WHERE username = ?", [currentUsername]);
		const user = currentUsers[0];

		// Verify password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.render("account/changeusername", {
				errorPassword: ACCOUNT.PASSWORD_WRONG,
				newUsername
			});
		}

		// Update username
		await db.execute("UPDATE users SET username = ? WHERE username = ?", [newUsername, currentUsername]);

		// Update session and redirect
		req.session.username = newUsername;
		req.session.changeSuccessful = ACCOUNT.USERNAME_CHANGED;
		req.session.save((error) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}
			return res.redirect("/account/changeusername");
		});

	} catch (err) {
		console.error(err);
		return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
	}
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

const handleChangePassword = async (req, res) => {
	const username = req.session.username;
	const { currentPassword, newPassword, passwordConfirm } = req.body;

	if (newPassword !== passwordConfirm) {
		return res.render("account/changepassword", {
			errorConfirm: ACCOUNT.PASSWORD_MISMATCH
		});
	}

	try {
		// Fetch user
		const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
		const user = users[0];

		// Check current password
		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) {
			return res.render("account/changepassword", {
				errorPassword: ACCOUNT.PASSWORD_WRONG
			});
		}

		// Hash new password and update DB
		const hashedPassword = await bcrypt.hash(newPassword, 8);
		await db.execute("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, username]);

		// Save session and redirect
		req.session.changeSuccessful = ACCOUNT.PASSWORD_CHANGED;
		req.session.save((error) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}
			return res.redirect("/account/changepassword");
		});

	} catch (err) {
		console.error(err);
		return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
	}
};

//--- Export ---//
module.exports = {
	showAccountMenu,
	showChangeUsername,
	handleChangeUsername,
	showChangePassword,
	handleChangePassword
};