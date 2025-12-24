import { ForbiddenError } from '#utils/errors.js';

//===============================================================================================//

export function requireWorldSession(req, res, next) {
	if (req.session.worldId && 
		req.session.worldType &&
		req.session.characterId) {
		res.locals.worldType = req.session.worldType;
		switch (req.session.worldType) {
			case 'Zo zuiver als goud':
				res.locals.worldClass = 'gold-world';
				break;
			case 'Belofte maakt schuld':
				res.locals.worldClass = 'debt-world';
				break;
			case 'De tijd brengt raad':
				res.locals.worldClass = 'time-world';
				break;
		}
		return next();
	}
	throw new ForbiddenError(
		'U moet eerst een wereld kiezen.',
		'/game/choose-world'
	);
}