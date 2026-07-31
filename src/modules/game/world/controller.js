import { prepareMenu } from './service.js';

//===============================================================================================//

export async function showMenu(req, res) {
	const { user, world } = req.session;
	
	const menu = await prepareMenu({
		userId: user.id,
		worldId: world.id
	});

	return res.render('game/world/menu', menu);
}