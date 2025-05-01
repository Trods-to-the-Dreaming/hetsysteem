const requireAuth = (req, res, next) => {
	if (req.session && req.session.userId) {
		res.locals.authenticated = true;
		next();
	} else {
		res.locals.authenticated = false;
		res.redirect("/auth/login");
	}
};

export default requireAuth;