const ACCOUNT = require("../constants/account");
const db = require("../utils/db");
const bcrypt = require("bcrypt");

//--- Show login page ---//
const showLogin = (req, res) => {
	res.render("auth/login");
};

//--- Handle login request ---//
const handleLogin = async (req, res) => {
	try {
		const { username, password } = req.body;
		const [users] = await db.execute("SELECT * FROM users WHERE name = ?", [username]);

		if (users.length === 0) {
			return res.render("auth/login", {
				errorLogin: ACCOUNT.INVALID_LOGIN,
				username
			});
		}

		const user = users[0];
		const match = await bcrypt.compare(password, user.password);

		if (match) {
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
	const { username, password, passwordConfirm } = req.body;

	if (password !== passwordConfirm) {
		return res.render("auth/register", {
			errorConfirm: ACCOUNT.PASSWORD_MISMATCH,
			username: username
		});
	}

	try {
		// Check if username exists
		const [users] = await db.execute("SELECT * FROM users WHERE name = ?", [username]);

		if (users.length > 0) {
			return res.render("auth/register", {
				errorUsername: ACCOUNT.USERNAME_TAKEN,
				username: username
			});
		}

		// Hash the password (using a Promise-based version of bcrypt)
		const hashedPassword = await bcrypt.hash(password, 8);

		// Insert the user
		await db.execute("INSERT INTO users (name, password) VALUES (?, ?)", [username, hashedPassword]);

		// Log in the user by creating a session
		req.session.username = username;
		req.session.save((err) => {
			if (err) {
				console.log(err);
				return res.status(500).send(ACCOUNT.UNEXPECTED_ERROR);
			}
			return res.redirect("/game/menu");
		});

	} catch (err) {
		console.error(err);
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
module.exports = {
	showLogin,
	handleLogin,
	showRegister,
	handleRegister,	
	handleLogout
};