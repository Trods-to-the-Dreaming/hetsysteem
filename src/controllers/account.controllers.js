import ACCOUNT from "../constants/account.js";
import db from "../utils/db.js";
import bcrypt from "bcrypt";

//--- Show account menu page ---//
const showAccountMenu = (req, res) => {
	res.render("account/menu");
};

//--- Show change username page ---//
const showChangeUsername = (req, res) => {
	const successChange = req.session.successChange;
	delete req.session.successChange;
	res.render("account/changeusername", {
		username: req.session.username,
		successChange: successChange
	});
};

const handleChangeUsername = async (req, res) => {
	const userId = req.session.userId;
	const { newUsername, 
			password } = req.body;

	try {
		// Check if username is already taken
		const [existingUsers] = await db.execute(
			"SELECT * FROM users WHERE name = ?",
			[newUsername]
		);
		if (existingUsers.length > 0) {
			return res.render("account/changeusername", {
				errorUsername: ACCOUNT.USERNAME_TAKEN,
				newUsername
			});
		}

		// Fetch user
		const [users] = await db.execute(
			"SELECT * FROM users WHERE id = ?", 
			[userId]
		);
		const user = users[0];

		// Verify password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.render("account/changeusername", {
				errorPassword: ACCOUNT.PASSWORD_WRONG,
				newUsername
			});
		}

		// Update username
		await db.execute(
			"UPDATE users SET name = ? WHERE id = ?", 
			[newUsername, userId]
		);

		// Update session
		req.session.username = newUsername
		req.session.successChange = ACCOUNT.USERNAME_CHANGED;
		req.session.save((error) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}
			return res.redirect("/account/changeusername");
		});

	} catch (error) {
		console.error(error);
		return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
	}
};

//--- Show change password page ---//
const showChangePassword = (req, res) => {
	const successChange = req.session.successChange;
	delete req.session.successChange;
	res.render("account/changepassword", {
		username: req.session.username,
		successChange: successChange
	});
};

const handleChangePassword = async (req, res) => {
	const username = req.session.username;
	const { currentPassword, 
			newPassword, 
			passwordConfirm } = req.body;

	// Check if passwords are the same
	if (newPassword !== passwordConfirm) {
		return res.render("account/changepassword", {
			errorConfirm: ACCOUNT.PASSWORD_MISMATCH
		});
	}

	try {
		// Fetch user
		const [users] = await db.execute(
			"SELECT * FROM users WHERE name = ?", 
			[username]
		);
		const user = users[0];

		// Verify current password
		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) {
			return res.render("account/changepassword", {
				errorPassword: ACCOUNT.PASSWORD_WRONG
			});
		}

		// Update password
		const hashedPassword = await bcrypt.hash(newPassword, 8);
		await db.execute(
			"UPDATE users SET password = ? WHERE name = ?", 
			[hashedPassword, username]
		);

		// Update session
		req.session.successChange = ACCOUNT.PASSWORD_CHANGED;
		req.session.save((error) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}
			return res.redirect("/account/changepassword");
		});

	} catch (error) {
		console.error(error);
		return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
	}
};

//--- Export ---//
export default {
	showAccountMenu,
	showChangeUsername,
	handleChangeUsername,
	showChangePassword,
	handleChangePassword
};