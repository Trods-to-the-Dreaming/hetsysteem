export function requireGuest(req, res, next) {
	if (!(req.session.userId && req.session.username)) {
		return next();
	}
	
	return res.redirect('/game/choose-world');
}
//-----------------------------------------------------------------------------------------------//
export function requireAuthenticated(req, res, next) {
	if (req.session.userId && req.session.username) {
		res.locals.authenticated = true;
		return next();
	}
	
	req.session.loginError = 'U moet eerst inloggen.';
	return res.redirect('/account/login');
}