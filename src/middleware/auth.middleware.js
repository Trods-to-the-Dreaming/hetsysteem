//=== Main ======================================================================================//
export const requireAuthenticated = (req, res, next) => {
	if (req.session.userId && 
		req.session.username) {
		res.locals.authenticated = true;
		next();
	} else {
		res.locals.authenticated = false;
		res.redirect("/auth/login");
	}
};