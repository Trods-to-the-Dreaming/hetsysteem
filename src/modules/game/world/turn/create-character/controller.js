import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import { 
	reserveCharacterName
} from './service.js';

//===============================================================================================//

export async function showCreateCharacter(req, res) {
	return res.render('game/world/turn/create-character');
}
//-----------------------------------------------------------------------------------------------//
export async function handleReserveCharacterName(req, res) {
	const { user, world } = req.session;
	const { firstName, lastName } = req.validatedData;

	try {
		const character = await reserveCharacterName({ 
			userId: user.id, 
			worldId: world.id, 
			firstName,
			lastName
		});
		
		return res.json({ 
			data: character
		});
	} catch (err) {
		if (err instanceof GameError) {
			if (err.code === GAME_ERROR.NO_NEW_CHARACTERS.code) {
				return res.status(err.status).json({
					redirect: '/game/world/turn/create-character/no-new-characters'
				});
			}
			
			return res.status(err.status).json({
				error: err.message
			});
		}

		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export function showNoNewCharacters(req, res) {
	return res.render('game/world/turn/create-character/no-new-characters');
};