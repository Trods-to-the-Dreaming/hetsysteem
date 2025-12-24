import { 
	regenerateSession,
	saveSession,
	destroySession
} from '#utils/session.js';

import { 
	findUserById,
	findUserByName,
	isUsernameTaken,
	createUser,
	updateUsername,
	updatePassword
} from './repository.js';

import { 
	authenticate
	/*findUserById,
	findUserByName,
	isUsernameTaken,
	isPasswordCorrect,
	registerUser,
	updateUsername,
	updatePassword*/
} from './service.js';

//===============================================================================================//

const MSG_INVALID_LOGIN	   = 'Ongeldige gebruikersnaam of wachtwoord.';
const MSG_USERNAME_TAKEN   = 'Deze naam is al in gebruik.';
const MSG_PASSWORD_WRONG   = 'Dit is niet uw wachtwoord.';
const MSG_USERNAME_CHANGED = 'Uw gebruikersnaam is gewijzigd.';
const MSG_PASSWORD_CHANGED = 'Uw wachtwoord is gewijzigd.';

//===============================================================================================//

export function showLogin(req, res, next) {
	const loginError = req.session.loginError;
	delete req.session.loginError;

	return res.render('account/login', {
		loginError
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleLogin(req, res, next) {
	const { username, 
			password } = req.validatedData;
	
	try {
		const user = await authenticate(username, password);
		if (!user) {
			return res.render('account/login', {
				username,
				loginError: MSG_INVALID_LOGIN,
			});
		}
		
		await regenerateSession(req);
		req.session.userId = user.id;
		req.session.username = user.name;
		await saveSession(req);
		
		return res.redirect('/game/enter-world');
	} catch (err) {
		await destroySession(req);
		next(err); 
	}
}
//-----------------------------------------------------------------------------------------------//
export async function handleLogout(req, res, next) {
	try {
		await destroySession(req);
		res.clearCookie('systeem_session_cookie');
		
		return res.redirect('/account/login');
	} catch (err) {
		next(err);
	}
}
//-----------------------------------------------------------------------------------------------//
export function showRegister(req, res, next) {
	return res.render('account/register');
}
//-----------------------------------------------------------------------------------------------//
export async function handleRegister(req, res, next) {
	const { username, 
			password } = req.validatedData;
	
	try { 
		const user = await registerUser(username, password);
		if (!user) {
			return res.render('account/register', {
				username,
				usernameError: MSG_USERNAME_TAKEN,
			});
		}

		await regenerateSession(req);
		req.session.userId = user.id;
		req.session.username = user.name
		await saveSession(req);
		
		return res.redirect('/game/enter-world');
	} catch (err) {
		await destroySession(req);
		next(err);
	}
}
//-----------------------------------------------------------------------------------------------//
export async function showAccount(req, res, next) {
	try {
		return res.render('account/my-account');
	} catch (err) {
		next(err); 
	}
}
//-----------------------------------------------------------------------------------------------//
export async function showChangeUsername(req, res, next) {
	const { username, 
			changeSaved, 
			changeMessage } = req.session;
	
	try {
		delete req.session.changeSaved;
		delete req.session.changeMessage;
		await saveSession(req);

		return res.render('account/change-username', {
			username,
			changeSaved,
			changeMessage
		});
	} catch (err) {
		await destroySession(req);
		next(err);
	}
}
//-----------------------------------------------------------------------------------------------//
export async function handleChangeUsername(req, res, next) {
	const { userId,
			username } = req.session;
	const { newUsername, 
			password } = req.validatedData;
	
	try {
		
		KAN DIT COMPACTER WORDEN GEMAAKT MET 1 ERROR IN HBS?
		ZIE CHATGPT LAATSTE BERICHT 24/12/2025
		
		if (newUsername === username) {
			return res.render('account/change-username', {
				username,
				newUsername,
				usernameError: MSG_USERNAME_UNCHANGED
			});
		}
		
		const { isUsernameTaken,
				isPasswordWrong } = await changeUsername(userId, newUsername, password);
		
		if (isUsernameTaken) {
			return res.render('account/change-username', {
				username,
				newUsername,
				usernameError: MSG_USERNAME_TAKEN
			});
		}

		if (isPasswordWrong) {
			return res.render('account/change-username', {
				username,
				newUsername,
				passwordError: MSG_PASSWORD_WRONG
			});
		}
		
		req.session.username = newUsername;
		req.session.changeSaved = true;
		req.session.changeMessage = MSG_USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account/change-username');
	} catch (err) {
		await destroySession(req);
		next(err); 
	}
}
//-----------------------------------------------------------------------------------------------//
export async function showChangePassword(req, res, next) {
	const { changeSaved, 
			changeMessage } = req.session;

	try {
		delete req.session.changeSaved;
		delete req.session.changeMessage;
		await saveSession(req);
	
		return res.render('account/change-password', {
			changeSaved,
			changeMessage
		});
	} catch (err) {
		await destroySession(req);
		next(err);
	}
}
//-----------------------------------------------------------------------------------------------//
export async function handleChangePassword(req, res, next) {
	const { userId } = req.session;
	const { newPassword,
			currentPassword } = req.validatedData;
	
	try {
		const { isUsernameTaken,
				isPasswordWrong } = await changePassword(userId, newPassword, currentPassword);
		
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
}