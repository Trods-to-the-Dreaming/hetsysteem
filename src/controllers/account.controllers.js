//=== Imports ===================================================================================//
import saveSession from "../utils/session.js";
import { 
	findUserById,
	findUserByName,
	isUsernameTaken,
	isPasswordCorrect,
	registerUser,
	updateUsername,
	updatePassword
} from "../utils/account.helpers.js";

//=== Constants =================================================================================//
const MSG_INVALID_LOGIN		= "Ongeldige gebruikersnaam of wachtwoord.";
const MSG_PASSWORD_MISMATCH = "De wachtwoorden komen niet overeen.";
const MSG_USERNAME_TAKEN	= "Deze gebruikersnaam is al in gebruik.";
const MSG_PASSWORD_WRONG	= "Dit is niet uw wachtwoord.";
const MSG_USERNAME_CHANGED	= "Uw gebruikersnaam is gewijzigd.";
const MSG_PASSWORD_CHANGED	= "Uw wachtwoord is gewijzigd.";

//=== Main ======================================================================================//

//--- Show login page ---------------------------------------------------------------------------//
export const showLogin = (req, res, next) => {
	try {
		return res.render("account/login");
	} catch (err) {
		next(err); 
	}
};

//--- Handle login request ----------------------------------------------------------------------//
export const handleLogin = async (req, res, next) => {
	try {
		const { username, 
				password } = req.body;

		// Find user
		const user = await findUserByName(username);
		if (!user) {
			return res.render("account/login", {
				error_login: MSG_INVALID_LOGIN,
				username
			});
		}

		// Verify password
		if (!(await isPasswordCorrect(user, password))) {
			return res.render("account/login", {
				error_login: MSG_INVALID_LOGIN,
				username
			});
		}

		// Start session
		req.session.userId = user.id;
		req.session.username = user.name;
		await saveSession(req);
		
		return res.redirect("/game/choose-world");
	} catch (err) {
		next(err); 
	}
};

//--- Show registration page --------------------------------------------------------------------//
export const showRegister = (req, res, next) => {
	try {
		return res.render("account/register");
	} catch (err) {
		next(err);
	}
};

//--- Handle registration request ---------------------------------------------------------------//
export const handleRegister = async (req, res, next) => {
	try {
		const { username, 
				password, 
				passwordConfirm } = req.body;

		// Check if passwords are the same
		if (password !== passwordConfirm) {
			return res.render("account/register", {
				error_confirm: MSG_PASSWORD_MISMATCH,
				username
			});
		}
		
		// Check if username is taken
		if (await isUsernameTaken(username)) {
			return res.render("account/register", {
				error_username: MSG_USERNAME_TAKEN,
				username
			});
		}

		// Register user
		const user = await registerUser(username, password);

		// Start session
		req.session.userId = user.insertId;
		req.session.username = username
		await saveSession(req);
		
		return res.redirect("/game/choose-world");
	} catch (err) {
		next(err);
	}
};

//--- Handle logout request ---------------------------------------------------------------------//
export const handleLogout = (req, res, next) => {
	try {
		req.session.destroy((error) => {
			if (error) {
				console.error(error);
				return res.status(500).render("errors/500"); 
			}
			res.clearCookie("systeem_session_cookie");
			res.redirect("/account/login");
		});
	} catch (err) {
		next(err);
	}
};

//--- Show account page -------------------------------------------------------------------------//
export const showAccount = (req, res, next) => {
	try {
		return res.render("account/my-account");
	} catch (err) {
		next(err); 
	}
};

//--- Show change username page -----------------------------------------------------------------//
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

//--- Handle change username request ------------------------------------------------------------//
export const handleChangeUsername = async (req, res, next) => {
	try {
		const { userId } = req.session;
		const { newUsername, 
				password } = req.body;
		
		// Check if new username is taken
		if (await isUsernameTaken(newUsername)) {
			return res.render("account/change-username", {
				error_username: MSG_USERNAME_TAKEN,
				new_username: newUsername
			});
		}

		// Find user
		const user = await findUserById(userId);

		// Verify password
		if (!(await isPasswordCorrect(user, password))) {
			return res.render("account/change-username", {
				error_password: MSG_PASSWORD_WRONG,
				new_username: newUsername
			});
		}

		// Update username
		await updateUsername(userId, newUsername);

		// Save session
		req.session.username = newUsername;
		req.session.changeSaved = true;
		req.session.changeMessage = MSG_USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/change-username");
	} catch (err) {
		next(err); 
	}
};

//--- Show change password page -----------------------------------------------------------------//
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

//--- Handle change password request ------------------------------------------------------------//
export const handleChangePassword = async (req, res, next) => {
	try {
		const { userId } = req.session;
		const { currentPassword, 
				newPassword, 
				passwordConfirm } = req.body;

		// Check if passwords are the same
		if (newPassword !== passwordConfirm) {
			return res.render("account/change-password", {
				error_confirm: MSG_PASSWORD_MISMATCH
			});
		}
		
		// Find user
		const user = await findUserById(userId);

		// Verify current password
		if (!(await isPasswordCorrect(user, password))) {
			return res.render("account/change-password", {
				error_password: MSG_PASSWORD_WRONG
			});
		}

		// Update password
		await updatePassword(userId, newPassword);

		// Save session
		req.session.changeSaved = true;
		req.session.changeMessage = MSG_PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect("/account/change-password");
	} catch (err) {
		next(err); 
	}
};