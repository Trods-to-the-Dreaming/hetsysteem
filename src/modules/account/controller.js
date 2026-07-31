import { 
	regenerateSession,
	saveSession,
	destroySession
} from '#utils/session.js';
//-----------------------------------------------------------------------------------------------//
import { AccountError } from './error.js';
import { 
	login,
	register,
	deregister,
	changeUsername,
	changePassword
} from './service.js';

//===============================================================================================//

const MSG_USERNAME_CHANGED = 'Uw gebruikersnaam is gewijzigd.';
const MSG_PASSWORD_CHANGED = 'Uw wachtwoord is gewijzigd.';

//===============================================================================================//

export function showLogin(req, res) {
	const { loginError } = req.session;
	
	delete req.session.loginError;

	return res.render('account/login', {
		loginError
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleLogin(req, res) {
	const { username, password } = req.validatedData;
	
	try {
		const user = await login({ 
			username, 
			password
		});
		
		await regenerateSession(req);
		req.session.user = {
			id: user.id,
			name: user.name
		};
		await saveSession(req);
		
		return res.redirect('/game/enter-world');
	} catch (err) {
		if (err instanceof AccountError) {
			return res.status(err.status).render('account/login', {
				username,
				loginError: err.message
			});
		}
		
		await destroySession(req);
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function handleLogout(req, res) {
	await destroySession(req);
	res.clearCookie('systeem_session_cookie');
	
	return res.redirect('/account/login');
}
//-----------------------------------------------------------------------------------------------//
export function showRegister(req, res) {
	const { registerError } = req.session;
	
	delete req.session.registerError;
	
	return res.render('account/register', {
		registerError
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleRegister(req, res) {
	const { username, password, invitationToken } = req.validatedData;
	
	try { 
		const user = await register({ 
			username, 
			password,
			invitationToken
		});

		await regenerateSession(req);
		req.session.user = {
			id: user.id,
			name: user.name
		};
		await saveSession(req);
		
		return res.redirect('/game/enter-world');
	} catch (err) {
		if (err instanceof AccountError) {
			return res.status(err.status).render('account/register', {
				username,
				registerError: err.message
			});
		}
		
		await destroySession(req);
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function handleDeregister(req, res) {
	const { user } = req.session;
	
	await deregister(user.id);
	
	await destroySession(req);
	res.clearCookie('systeem_session_cookie');
	
	return res.redirect('/account/login');
}
//-----------------------------------------------------------------------------------------------//
export function showAccount(req, res) {
	const { user, changeAccountSuccess } = req.session;
	
	delete req.session.changeAccountSuccess;
	
	return res.render('account/my-account', {
		username: user.name,
		changeAccountSuccess
	});
}
//-----------------------------------------------------------------------------------------------//
export function showChangeUsername(req, res) {
	const { user } = req.session;

	return res.render('account/change-username', {
		username: user.name
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleChangeUsername(req, res) {
	const { user } = req.session;
	const { newUsername, password } = req.validatedData;
	
	try {
		await changeUsername({ 
			userId: user.id, 
			newUsername, 
			password 
		});
		
		req.session.user.name = newUsername;
		req.session.changeAccountSuccess = MSG_USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account');
	} catch (err) {
		if (err instanceof AccountError) {
			return res.status(err.status).render('account/change-username', {
				username: user.name,
				newUsername,
				changeUsernameError: err.message
			});
		}
		
		await destroySession(req);
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export function showChangePassword(req, res) {
	return res.render('account/change-password');
}
//-----------------------------------------------------------------------------------------------//
export async function handleChangePassword(req, res) {
	const { user } = req.session;
	const { newPassword, password } = req.validatedData;
	
	try {
		await changePassword({ 
			userId: user.id, 
			newPassword, 
			password
		});

		req.session.changeAccountSuccess = MSG_PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account');
	} catch (err) {
		if (err instanceof AccountError) {
			return res.status(err.status).render('account/change-password', {
				changePasswordError: err.message
			});
		}
		
		await destroySession(req);
		throw err;
	}
}