export function requireToken(req, res, next) {
	const auth = req.headers.authorization;

	if (auth === `Bearer ${process.env.CRON_TOKEN}`) {
		return next();
	}

	return res.sendStatus(401);
}