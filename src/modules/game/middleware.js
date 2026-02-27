export async function requireWorldEntered(req, res, next) {
	if (req.session.world) {
		res.locals.world = req.session.world;
		return next();
	}
	
	return res.redirect('/game/enter-world');
}
//-----------------------------------------------------------------------------------------------//
export async function requireCharacterCreated(req, res, next) {
	if (req.session.isCharacterCreated)
		return next();
	
	return res.redirect('/game/create-character');
}
//-----------------------------------------------------------------------------------------------//
export async function requireNoCharacterCreated(req, res, next) {
	if (!req.session.isCharacterCreated)
		return next();
	
	return res.redirect('/game/start-turn');
}
//-----------------------------------------------------------------------------------------------//
export function requireToken(req, res, next) {
	const auth = req.headers.authorization;

	if (auth === `Bearer ${process.env.CRON_TOKEN}`)
		return next();

	return res.sendStatus(401);
}