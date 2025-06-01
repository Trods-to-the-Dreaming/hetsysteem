import ACCOUNT_ERRORS from "../constants/account.errors.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";
import bcrypt from "bcrypt";

//--- Show account page ---//
export const showAccount = (req, res) => {
	try {
		res.render("account/my-account");
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
		res.render("account/change-username", {
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
			`SELECT * 
			 FROM users 
			 WHERE name = ?`,
			[newUsername]
		);
		if (usersWithName.length > 0) {
			return res.render("account/change-username", {
				error_username: ACCOUNT_ERRORS.USERNAME_TAKEN,
				new_username: newUsername
			});
		}

		// Fetch user
		const [usersWithId] = await db.execute(
			`SELECT * 
			 FROM users 
			 WHERE id = ?`, 
			[userId]
		);
		const user = usersWithId[0];

		// Verify password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.render("account/change-username", {
				error_password: ACCOUNT_ERRORS.PASSWORD_WRONG,
				new_username: newUsername
			});
		}

		// Update username
		await db.execute(
			`UPDATE users 
			SET name = ? 
			WHERE id = ?`, 
			[newUsername, 
			 userId]
		);

		// Save session
		req.session.username = newUsername
		req.session.successChange = ACCOUNT_ERRORS.USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/change-username");
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
		res.render("account/change-password", {
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
			return res.render("account/change-password", {
				error_confirm: ACCOUNT_ERRORS.PASSWORD_MISMATCH
			});
		}
		
		// Fetch user
		const [usersWithId] = await db.execute(
			`SELECT * 
			 FROM users 
			 WHERE id = ?`, 
			[userId]
		);
		const user = usersWithId[0];

		// Verify current password
		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) {
			return res.render("account/change-password", {
				error_password: ACCOUNT_ERRORS.PASSWORD_WRONG
			});
		}

		// Update password
		const hashedPassword = await bcrypt.hash(newPassword, 8);
		await db.execute(
			`UPDATE users 
			 SET password = ? 
			 WHERE id = ?`, 
			[hashedPassword, 
			 userId]
		);

		// Save session
		req.session.successChange = ACCOUNT_ERRORS.PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/change-password");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};