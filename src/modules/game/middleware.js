import { 
	saveSession 
} from '#utils/session.js';

//===============================================================================================//

const MSG_ENTER_WORLD_ERROR = 'U moet eerst een wereld kiezen.';

//===============================================================================================//

export async function requireWorldEntered(req, res, next) {
	if (req.session.world && req.session.character) {
		res.locals.world = req.session.world;
		res.locals.character = req.session.character;
		return next();
	}
	
	req.session.enterWorldError = MSG_ENTER_WORLD_ERROR;
	await saveSession(req);
	
	return res.redirect('/game/enter-world');
}
//-----------------------------------------------------------------------------------------------//
export function requireToken(req, res, next) {
	const auth = req.headers.authorization;

	if (auth === `Bearer ${process.env.CRON_TOKEN}`) {
		return next();
	}

	return res.sendStatus(401);
}