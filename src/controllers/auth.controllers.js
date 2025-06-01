import ACCOUNT_ERRORS from "../constants/account.errors.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";
import bcrypt from "bcrypt";

//--- Show login page ---//
export const showLogin = (req, res) => {
	try {
		res.render("auth/login");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Handle login request ---//
export const handleLogin = async (req, res) => {
	try {
		const { username, 
				password } = req.body;

		// Fetch user
		const [usersWithName] = await db.execute(
			`SELECT * 
			 FROM users 
			 WHERE name = ?`, 
			[username]
		);
		if (usersWithName.length === 0) {
			return res.render("auth/login", {
				error_login: ACCOUNT_ERRORS.INVALID_LOGIN,
				username
			});
		}
		const user = usersWithName[0];

		// Verify password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.render("auth/login", {
				error_login: ACCOUNT_ERRORS.INVALID_LOGIN,
				username
			});
		}

		// Start session
		req.session.userId = user.id;
		req.session.username = user.name;
		await saveSession(req);
		
		return res.redirect("/game/choose-world");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Show registration page ---//
export const showRegister = (req, res) => {
	try {
		res.render("auth/register");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Handle registration request ---//
export const handleRegister = async (req, res) => {
	try {
		const { username, 
				password, 
				passwordConfirm } = req.body;

		// Check if passwords are the same
		if (password !== passwordConfirm) {
			return res.render("auth/register", {
				error_confirm: ACCOUNT_ERRORS.PASSWORD_MISMATCH,
				username
			});
		}
		
		// Check if username is already taken
		const [usersWithName] = await db.execute(
			`SELECT * 
			 FROM users 
			 WHERE name = ?`, 
			[username]
		);
		if (usersWithName.length > 0) {
			return res.render("auth/register", {
				error_username: ACCOUNT_ERRORS.USERNAME_TAKEN,
				username
			});
		}

		// Register user
		const hashedPassword = await bcrypt.hash(password, 8);
		const [user] = await db.execute(
			`INSERT INTO users (name, password) 
			 VALUES (?, ?)`, 
			[username, 
			 hashedPassword]
		);

		// Start session
		req.session.userId = user.insertId;
		req.session.username = username
		await saveSession(req);
		
		return res.redirect("/game/choose-world");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Handle logout request ---//
export const handleLogout = (req, res) => {
	try {
		req.session.destroy((error) => {
			if (error) {
				console.error(error);
				return res.status(500).render("errors/500"); 
			}
			res.clearCookie("systeem_session_cookie");
			res.redirect("/auth/login");
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};