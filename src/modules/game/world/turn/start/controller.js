import { 
	saveSession
} from '#utils/session.js';
//-----------------------------------------------------------------------------------------------//
import { 
	loadTurn,
	startTurn
} from './service.js';

//===============================================================================================//

export async function showStartTurn(req, res) {
	const { user, world } = req.session;

	const turn = await loadTurn({ 
		userId: user.id, 
		worldId: world.id
	});
	
	return res.render('game/world/turn/start', turn);
};
//-----------------------------------------------------------------------------------------------//
export async function handleStartTurn(req, res) {
	const { user, world } = req.session;

	const turn = await startTurn({ 
		userId: user.id, 
		worldId: world.id
	});

	return res.json({ 
		data: turn 
	});
};