import { 
	regenerateSession,
	saveSession,
	destroySession
} from '#utils/session.js';
//-----------------------------------------------------------------------------------------------//
import { 
	ACCOUNT 
} from './reasons.js';
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

export function showLogin(req, res) {
	const { loginError } = req.session;
	delete req.session.loginError;

	return res.render('account/login', {
		errorMessage: loginError
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleLogin(req, res) {
	const { username, 
			password } = req.validatedData;
	
	try {
		const result = await login({ 
			username, 
			password
		});
		if (!result.ok) {
			return res.render('account/login', {
				username,
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		const user = result.value;
		
		await regenerateSession(req);
		req.session.user = user;
		await saveSession(req);
		
		return res.redirect('/game/enter-world');
	} catch (err) {
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
	return res.render('account/register');
}
//-----------------------------------------------------------------------------------------------//
export async function handleRegister(req, res) {
	const { username, 
			password } = req.validatedData;
	
	try { 
		const result = await register({ 
			username, 
			password 
		});
		if (!result.ok) {
			return res.render('account/register', {
				username,
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		const user = result.value;

		await regenerateSession(req);
		req.session.user = user;
		await saveSession(req);
		
		return res.redirect('/game/enter-world');
	} catch (err) {
		await destroySession(req);
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export function showAccount(req, res) {
	return res.render('account/my-account');
}
//-----------------------------------------------------------------------------------------------//
export function showChangeUsername(req, res) {
	const { user, 
			usernameChanged } = req.session;
	delete req.session.usernameChanged;

	return res.render('account/change-username', {
		username: user.name,
		successMessage: usernameChanged
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleChangeUsername(req, res) {
	const { user } = req.session;
	const { newUsername, 
			password } = req.validatedData;
	
	try {
		const result = await changeUsername({ 
			userId: user.id, 
			newUsername, 
			password 
		});
		if (!result.ok) {
			return res.render('account/change-username', {
				username: user.name,
				newUsername,
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		req.session.user.name = newUsername;
		req.session.usernameChanged = MSG_USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account/change-username');
	} catch (err) {
		await destroySession(req);
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export function showChangePassword(req, res) {
	const { passwordChanged } = req.session;
	delete req.session.passwordChanged;

	return res.render('account/change-password', {
		changeSaved,
		successMessage: passwordChanged
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleChangePassword(req, res) {
	const { user } = req.session;
	const { newPassword,
			password } = req.validatedData;
	
	try {
		const result = await changePassword({ 
			userId: user.id, 
			newPassword, 
			password
		});
		if (!result.ok) {
			return res.render('account/change-password', {
				errorMessage: ACCOUNT.MESSAGE[result.reason]
			});
		}

		req.session.passwordChanged = MSG_PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account/change-password');
	} catch (err) {
		await destroySession(req);
		throw err;
	}
}