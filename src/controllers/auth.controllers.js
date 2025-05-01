import ACCOUNT from "../constants/account.js";
import db from "../utils/db.js";
import bcrypt from "bcrypt";

//--- Show login page ---//
const showLogin = (req, res) => {
	res.render("auth/login");
};

//--- Handle login request ---//
const handleLogin = async (req, res) => {
	try {
		const { username, 
				password } = req.body;
		
		// Fetch user
		const [users] = await db.execute(
			"SELECT * FROM users WHERE name = ?", 
			[username]
		);
		if (users.length === 0) {
			return res.render("auth/login", {
				errorLogin: ACCOUNT.INVALID_LOGIN,
				username
			});
		}
		const user = users[0];
		
		// Verify password
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			// Start session
			req.session.userId = user.id;
			req.session.username = user.name;
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
				username
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
	}
};

//--- Show registration page ---//
const showRegister = (req, res) => {
	res.render("auth/register");
};

//--- Handle registration request ---//
const handleRegister = async (req, res) => {
	const { username, 
			password, 
			passwordConfirm } = req.body;

	// Check if passwords are the same
	if (password !== passwordConfirm) {
		return res.render("auth/register", {
			errorConfirm: ACCOUNT.PASSWORD_MISMATCH,
			username: username
		});
	}

	try {
		// Check if username is already taken
		const [existingUsers] = await db.execute(
			"SELECT * FROM users WHERE name = ?", 
			[username]
		);
		if (existingUsers.length > 0) {
			return res.render("auth/register", {
				errorUsername: ACCOUNT.USERNAME_TAKEN,
				username: username
			});
		}

		// Register user
		const hashedPassword = await bcrypt.hash(password, 8);
		const [user] = await db.execute(
			"INSERT INTO users (name, password) VALUES (?, ?)", 
			[username, hashedPassword]
		);

		// Start session
		req.session.userId = user.insertId;
		req.session.username = username
		req.session.save((error) => {
			if (error) {
				console.log(error);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}
			return res.redirect("/game/menu");
		});

	} catch (error) {
		console.error(error);
		return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
	}
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
export default {
	showLogin,
	handleLogin,
	showRegister,
	handleRegister,	
	handleLogout
};