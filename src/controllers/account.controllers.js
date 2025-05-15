import ACCOUNT from "../constants/account.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";
import bcrypt from "bcrypt";

//--- Show account menu page ---//
export const showAccountMenu = (req, res) => {
	try {
		res.render("account/menu");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Show change username page ---//
export const showChangeUsername = (req, res) => {	
	try {
		const successChange = req.session.successChange;
		delete req.session.successChange;
		res.render("account/changeusername", {
			username: req.session.username,
			success_change: successChange
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Handle change username request ---//
export const handleChangeUsername = async (req, res) => {
	try {
		const { userId } = req.session;
		const { newUsername, 
				password } = req.body;
		
		// Check if username is already taken
		const [usersWithName] = await db.execute(
			`SELECT * FROM users WHERE name = ?`,
			[newUsername]
		);
		if (usersWithName.length > 0) {
			return res.render("account/changeusername", {
				error_username: ACCOUNT.USERNAME_TAKEN,
				new_username: newUsername
			});
		}

		// Fetch user
		const [usersWithId] = await db.execute(
			`SELECT * FROM users WHERE id = ?`, 
			[userId]
		);
		const user = usersWithId[0];

		// Verify password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.render("account/changeusername", {
				error_password: ACCOUNT.PASSWORD_WRONG,
				new_username: newUsername
			});
		}

		// Update username
		await db.execute(
			`UPDATE users SET name = ? WHERE id = ?`, 
			[newUsername, userId]
		);

		// Save session
		req.session.username = newUsername
		req.session.successChange = ACCOUNT.USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/changeusername");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Show change password page ---//
export const showChangePassword = (req, res) => {
	try {
		const successChange = req.session.successChange;
		delete req.session.successChange;
		res.render("account/changepassword", {
			username: req.session.username,
			success_change: successChange
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Handle change password request ---//
export const handleChangePassword = async (req, res) => {
	try {
		const { userId } = req.session;
		const { currentPassword, 
				newPassword, 
				passwordConfirm } = req.body;

		// Check if passwords are the same
		if (newPassword !== passwordConfirm) {
			return res.render("account/changepassword", {
				error_confirm: ACCOUNT.PASSWORD_MISMATCH
			});
		}
		
		// Fetch user
		const [usersWithId] = await db.execute(
			`SELECT * FROM users WHERE id = ?`, 
			[userId]
		);
		const user = usersWithId[0];

		// Verify current password
		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) {
			return res.render("account/changepassword", {
				error_password: ACCOUNT.PASSWORD_WRONG
			});
		}

		// Update password
		const hashedPassword = await bcrypt.hash(newPassword, 8);
		await db.execute(
			`UPDATE users SET password = ? WHERE id = ?`, 
			[hashedPassword, userId]
		);

		// Save session
		req.session.successChange = ACCOUNT.PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/changepassword");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};