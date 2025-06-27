import ACCOUNT_MSG from "../constants/account.messages.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";
import bcrypt from "bcrypt";

//--- Show account page ---//
export const showAccount = (req, res, next) => {
	try {
		return res.render("account/my-account");
	} catch (err) {
		next(err); 
	}
};

//--- Show change username page ---//
export const showChangeUsername = async (req, res, next) => {
	try {
		const { changeSaved, 
				changeMessage } = req.session;

		delete req.session.changeSaved;
		delete req.session.changeMessage;
		await saveSession(req);
		
		return res.render("account/change-username", {
			username: req.session.username,
			change_saved: !!changeSaved,
			change_message: changeMessage
		});
	} catch (err) {
		next(err); 
	}
};

//--- Handle change username request ---//
export const handleChangeUsername = async (req, res, next) => {
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
				error_username: ACCOUNT_MSG.USERNAME_TAKEN,
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
				error_password: ACCOUNT_MSG.PASSWORD_WRONG,
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
		req.session.username = newUsername;
		req.session.changeSaved = true;
		req.session.changeMessage = ACCOUNT_MSG.USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/change-username");
	} catch (err) {
		next(err); 
	}
};

//--- Show change password page ---//
export const showChangePassword = async (req, res, next) => {
	try {
		const { changeSaved, 
				changeMessage } = req.session;

		delete req.session.changeSaved;
		delete req.session.changeMessage;
		await saveSession(req);
		
		return res.render("account/change-password", {
			username: req.session.username,
			change_saved: !!changeSaved,
			change_message: changeMessage
		});
	} catch (err) {
		next(err); 
	}
};

//--- Handle change password request ---//
export const handleChangePassword = async (req, res, next) => {
	try {
		const { userId } = req.session;
		const { currentPassword, 
				newPassword, 
				passwordConfirm } = req.body;

		// Check if passwords are the same
		if (newPassword !== passwordConfirm) {
			return res.render("account/change-password", {
				error_confirm: ACCOUNT_MSG.PASSWORD_MISMATCH
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
				error_password: ACCOUNT_MSG.PASSWORD_WRONG
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
		req.session.changeSaved = true;
		req.session.changeMessage = ACCOUNT_MSG.PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/change-password");
	} catch (err) {
		next(err); 
	}
};