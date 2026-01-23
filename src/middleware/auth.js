export function requireGuest(req, res, next) {
	if (!req.session.user)
		return next();
	
	return res.redirect('/game/enter-world');
}
//-----------------------------------------------------------------------------------------------//
export async function requireLogin(req, res, next) {
	if (req.session.user)
		return next();
	
	return res.redirect('/account/login');
}