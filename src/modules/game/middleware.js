import rateLimit from 'express-rate-limit';
//-----------------------------------------------------------------------------------------------//
import { 
	isCharacterCreated
} from './service.js';

//===============================================================================================//

export const limitReserveBuildingNameRate = rateLimit({
	windowMs: 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => String(req.session.user.id)
});
//-----------------------------------------------------------------------------------------------//
export async function requireWorldEntered(req, res, next) {
	if (req.session.world) {
		res.locals.world = req.session.world;
		return next();
	}
	
	return res.redirect('/game/enter-world');
}
//-----------------------------------------------------------------------------------------------//
export function requireCharacterCreated(condition = true) {
	return async function(req, res, next) {
		const { user, world } = req.session;
		
		const exists = await isCharacterCreated({
			userId: user.id,
			worldId: world.id
		});
		
		if (exists === condition) 
			return next();
		
		return res.redirect('/game');
	};
}
//-----------------------------------------------------------------------------------------------//
export function requireToken(req, res, next) {
	const auth = req.headers.authorization;

	if (auth === `Bearer ${process.env.CRON_TOKEN}`)
		return next();

	return res.sendStatus(401);
}

