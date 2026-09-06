import { GameError } from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import { 
	loadTurn,
	startTurn,
	saveTurn,
	processActions 
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
	const { overrule } = req.validatedData;

	try {
		const turnVersion = await startTurn({ 
			userId: user.id, 
			worldId: world.id,
			overrule
		});
		
		return res.json({
			data: turnVersion
		});
	} catch (err) {
		if (err instanceof GameError) {
			return res.status(err.status).json({
				error: err.message
			});
		}

		throw err;
	}
};
//-----------------------------------------------------------------------------------------------//
export function showFinishTurn(req, res) {
	return res.render('game/world/turn/finish');
};
//-----------------------------------------------------------------------------------------------//
export async function handleFinishTurn(req, res) {
	const { user, world } = req.session;
	const { characterPhases } = req.validatedData; //+ turnEditVersion?
	
	await saveTurn({ 
		userId: user.id, 
		worldId: world.id, 
		characterPhases 
	});
	
	return res.redirect('/game/world/menu');
};
//-----------------------------------------------------------------------------------------------//
export async function triggerProcessActions(req, res) {
	await processActions();
	
	return res.sendStatus(204);
};