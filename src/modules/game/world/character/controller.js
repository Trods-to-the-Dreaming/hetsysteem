import { prepareCharacter } from './service.js';

//===============================================================================================//

export async function showCharacter(req, res) {
	const { user, world } = req.session;
	
	const character = await prepareCharacter({ 
		userId: user.id, 
		worldId: world.id
	});
	
	return res.render('game/world/character', character);
}