//=== Imports ===================================================================================//
import saveSession from '../utils/session.js';

import { 
	MSG_INVALID_LOGIN,
	MSG_USERNAME_TAKEN,
	MSG_PASSWORD_WRONG,
	MSG_USERNAME_CHANGED,
	MSG_PASSWORD_CHANGED
} from '../constants/account.messages.js';

import { 
	findUserById,
	findUserByName,
	isUsernameTaken,
	isPasswordCorrect,
	registerUser,
	updateUsername,
	updatePassword
} from '../helpers/account.helpers.js';

//=== Main ======================================================================================//

//--- Log in ------------------------------------------------------------------------------------//
export const showLogin = (req, res, next) => {
	try {
		return res.render('account/login');
	} catch (err) {
		next(err); 
	}
};

export const handleLogin = async (req, res, next) => {
	try {
		const { username, 
				password } = req.body;

		// Find user
		const user = await findUserByName(username);
		if (!user) {
			return res.render('account/login', {
				username,
				loginError: MSG_INVALID_LOGIN
			});
		}

		// Verify password
		if (!(await isPasswordCorrect(user, password))) {
			return res.render('account/login', {
				username,
				loginError: MSG_INVALID_LOGIN
			});
		}

		// Start session
		req.session.userId = user.id;
		req.session.username = user.name;
		await saveSession(req);
		
		return res.redirect('/game/setup/choose-world');
	} catch (err) {
		next(err); 
	}
};

//--- Register ----------------------------------------------------------------------------------//
export const showRegister = (req, res, next) => {
	try {
		return res.render('account/register');
	} catch (err) {
		next(err);
	}
};

export const handleRegister = async (req, res, next) => {
	try {
		const { username, 
				password, 
				passwordConfirmation } = req.body;

		// Check if passwords are the same
		if (password !== passwordConfirmation) {
			return res.render('account/register', {
				username
			});
		}
		
		// Check if username is taken
		if (await isUsernameTaken(username)) {
			return res.render('account/register', {
				username,
				usernameError: MSG_USERNAME_TAKEN
			});
		}

		// Register user
		const user = await registerUser(username, password);

		// Start session
		req.session.userId = user.id;
		req.session.username = user.name
		await saveSession(req);
		
		return res.redirect('/game/setup/choose-world');
	} catch (err) {
		next(err);
	}
};

//--- Log out -----------------------------------------------------------------------------------//
export const handleLogout = (req, res, next) => {
	try {
		req.session.destroy((error) => {
			if (error) {
				console.error(error);
				return res.status(500).render('errors/500'); 
			}
			res.clearCookie('systeem_session_cookie');
			res.redirect('/account/login');
		});
	} catch (err) {
		next(err);
	}
};

//--- Account -----------------------------------------------------------------------------------//
export const showAccount = (req, res, next) => {
	try {
		return res.render('account/my-account');
	} catch (err) {
		next(err); 
	}
};

//--- Change username ---------------------------------------------------------------------------//
export const showChangeUsername = async (req, res, next) => {
	try {
		const { username,
				changeSaved, 
				changeMessage } = req.session;

		delete req.session.changeSaved;
		delete req.session.changeMessage;
		await saveSession(req);
		
		return res.render('account/change-username', {
			username,
			change_saved: 	!!changeSaved,
			change_message: changeMessage
		});
	} catch (err) {
		next(err); 
	}
};

export const handleChangeUsername = async (req, res, next) => {
	try {
		const { userId,
				username} = req.session;
		const { newUsername, 
				password } = req.body;
		
		// Check if new username is taken
		if (await isUsernameTaken(newUsername)) {
			return res.render('account/change-username', {
				username,
				newUsername:   newUsername,
				usernameError: MSG_USERNAME_TAKEN
			});
		}

		// Find user
		const user = await findUserById(userId);

		// Verify password
		if (!(await isPasswordCorrect(user, password))) {
			return res.render('account/change-username', {
				username,
				newUsername:   newUsername,
				passwordError: MSG_PASSWORD_WRONG
			});
		}

		// Update username
		await updateUsername(userId, newUsername);

		// Save session
		req.session.username = newUsername;
		req.session.changeSaved = true;
		req.session.changeMessage = MSG_USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account/change-username');
	} catch (err) {
		next(err); 
	}
};

//--- Change password ---------------------------------------------------------------------------//
export const showChangePassword = async (req, res, next) => {
	try {
		const { changeSaved, 
				changeMessage } = req.session;

		delete req.session.changeSaved;
		delete req.session.changeMessage;
		await saveSession(req);
		
		return res.render('account/change-password', {
			change_saved: 	!!changeSaved,
			change_message: changeMessage
		});
	} catch (err) {
		next(err); 
	}
};

export const handleChangePassword = async (req, res, next) => {
	try {
		const { userId } = req.session;
		const { currentPassword, 
				newPassword, 
				passwordConfirmation } = req.body;

		// Check if passwords are the same
		if (newPassword !== passwordConfirmation) {
			return res.render('account/change-password');
		}
		
		// Find user
		const user = await findUserById(userId);

		// Verify current password
		if (!(await isPasswordCorrect(user, currentPassword))) {
			return res.render('account/change-password', {
				passwordError: MSG_PASSWORD_WRONG
			});
		}

		// Update password
		await updatePassword(userId, newPassword);

		// Save session
		req.session.changeSaved = true;
		req.session.changeMessage = MSG_PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account/change-password');
	} catch (err) {
		next(err); 
	}
};