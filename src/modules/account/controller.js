import { 
	regenerateSession,
	saveSession,
	destroySession
} from '#utils/session.js';

import { ACCOUNT } from './reasons.js';

import { 
	login,
	register,
	changeUsername,
	changePassword
} from './service.js';

//===============================================================================================//

const MSG_USERNAME_CHANGED = 'Uw gebruikersnaam is gewijzigd.';
const MSG_PASSWORD_CHANGED = 'Uw wachtwoord is gewijzigd.';

//===============================================================================================//

export function showLogin(req, res, next) {
	const errorMessage = req.session.loginError;
	delete req.session.loginError;

	return res.render('account/login', {
		errorMessage
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleLogin(req, res, next) {
	const { username, 
			password } = req.validatedData;
	
	try {
		const result = await login(username, password);
		if (!result.ok) {
			return res.render('account/login', {
				username,
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		const user = result.value;
		
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
		const result = await register(username, password);
		if (!result.ok) {
			return res.render('account/register', {
				username,
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		const user = result.value;

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
		const result = await changeUsername(userId, newUsername, password);
		if (!result.ok) {
			return res.render('account/change-username', {
				username,
				newUsername,
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		req.session.username = newUsername;
		req.session.changeSaved = true;
		req.session.changeMessage = 'Uw gebruikersnaam is gewijzigd.';
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
			password } = req.validatedData;
	
	try {
		const result = await changePassword(userId, newPassword, password);
		if (!result.ok) {
			return res.render('account/change-password', {
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}

		req.session.changeSaved = true;
		req.session.changeMessage = 'Uw wachtwoord is gewijzigd.';
		await saveSession(req);
		
		return res.redirect('/account/change-password');
	} catch (err) {
		next(err); 
	}
}