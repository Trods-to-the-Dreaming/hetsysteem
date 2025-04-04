function requireAuth(req, res, next) {
	console.log('requireAuth - Session:', req.session, req.sessionID);
	if (req.session && req.session.username) {
        res.locals.authenticated = true;
		next(); // User is authenticated, continue to the requested page
    } else {
        res.locals.authenticated = false;
		res.redirect("/auth/login"); // Redirect to login if not authenticated
    }
}

module.exports = requireAuth;