import { 
	saveSession 
} from '#utils/session.js';

//===============================================================================================//

const MSG_LOGIN_ERROR = 'U moet eerst inloggen.';

//===============================================================================================//

export function requireGuest(req, res, next) {
	if (!req.session.user)
		return next();
	
	return res.redirect('/game/enter-world');
}
//-----------------------------------------------------------------------------------------------//
export async function requireLogin(req, res, next) {
	if (req.session.user)
		return next();
	
	req.session.loginError = MSG_LOGIN_ERROR;
	await saveSession(req);
	
	return res.redirect('/account/login');
}