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
	const { 
		username, 
		password 
	} = req.validatedData;
	
	try {
		const result = await login({ 
			username, 
			password
		});
		if (!result.ok) {
			return res.status(result.status).render('account/login', {
				username,
				loginError: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		await regenerateSession(req);
		req.session.user = {
			id: result.value.id,
			name: result.value.name
		};
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
	const { registerError } = req.session;
	delete req.session.registerError;
	
	return res.render('account/register', {
		registerError
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleRegister(req, res) {
	const { 
		username, 
		password,
		invitationToken
	} = req.validatedData;
	
	try { 
		const result = await register({ 
			username, 
			password,
			invitationToken
		});
		if (!result.ok) {
			return res.status(result.status).render('account/register', {
				username,
				registerError: ACCOUNT.MESSAGE[result.reason]
			});
		}

		await regenerateSession(req);
		req.session.user = {
			id: result.value.id,
			name: result.value.name
		};
		await saveSession(req);
		
		return res.redirect('/game/enter-world');
	} catch (err) {
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
	const { 
		user,
		changeAccountSuccess 
	} = req.session;
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
	const { 
		newUsername, 
		password 
	} = req.validatedData;
	
	try {
		const result = await changeUsername({ 
			userId: user.id, 
			newUsername, 
			password 
		});
		if (!result.ok) {
			return res.status(result.status).render('account/change-username', {
				username: user.name,
				newUsername,
				changeUsernameError: ACCOUNT.MESSAGE[result.reason]
			});
		}
		
		req.session.user.name = newUsername;
		req.session.changeAccountSuccess = MSG_USERNAME_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account');
	} catch (err) {
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
	const { 
		newPassword,
		password 
	} = req.validatedData;
	
	try {
		const result = await changePassword({ 
			userId: user.id, 
			newPassword, 
			password
		});
		if (!result.ok) {
			return res.status(result.status).render('account/change-password', {
				changePasswordError: ACCOUNT.MESSAGE[result.reason]
			});
		}

		req.session.changeAccountSuccess = MSG_PASSWORD_CHANGED;
		await saveSession(req);
		
		return res.redirect('/account');
	} catch (err) {
		await destroySession(req);
		throw err;
	}
}