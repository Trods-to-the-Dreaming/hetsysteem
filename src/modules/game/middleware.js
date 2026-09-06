import rateLimit from 'express-rate-limit';
//-----------------------------------------------------------------------------------------------//
import { 
	canCreateCharacter,
	isCharacterCreated
} from './service.js';

//===============================================================================================//

export const limitStartTurnRate = rateLimit({
	windowMs: 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => String(req.session.user.id)
});
//-----------------------------------------------------------------------------------------------//
export const limitFinishTurnRate = rateLimit({
	windowMs: 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => String(req.session.user.id)
});
//-----------------------------------------------------------------------------------------------//
export const limitReserveCharacterNameRate = rateLimit({
	windowMs: 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => String(req.session.user.id)
});
//-----------------------------------------------------------------------------------------------//
export const limitReserveBuildingNameRate = rateLimit({
	windowMs: 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => String(req.session.user.id)
});
//-----------------------------------------------------------------------------------------------//
export function requireWorldEntered(req, res, next) {
	const { world } = req.session;
	
	if (world) {
		res.locals.world = world;
		return next();
	}
	
	return res.redirect('/game/enter-world');
}
//-----------------------------------------------------------------------------------------------//
export async function requireCanPlayTurn(req, res, next) {
	const { user, world } = req.session;
	const [
		hasCharacter, 
		mayCreateCharacter
	] = await Promise.all([
		isCharacterCreated({ 
			userId: user.id, 
			worldId: world.id 
		}),
		canCreateCharacter({ 
			userId: user.id, 
			worldId: world.id 
		})
	]);
	
	if (hasCharacter || mayCreateCharacter) 
		return next();
	
	return res.redirect('/game/world/menu');
}
//-----------------------------------------------------------------------------------------------//
export async function requireCharacterCreated(req, res, next) {
	const { user, world } = req.session;
	const hasCharacter = await isCharacterCreated({ 
		userId: user.id, 
		worldId: world.id 
	})
	
	if (hasCharacter) 
		return next();
	
	return res.redirect('/game/world/menu');
}
//-----------------------------------------------------------------------------------------------//
export function requireToken(req, res, next) {
	const auth = req.headers.authorization;

	if (auth === `Bearer ${process.env.CRON_TOKEN}`)
		return next();

	return res.sendStatus(401);
}