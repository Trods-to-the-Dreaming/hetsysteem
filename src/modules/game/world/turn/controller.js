import { 
	loadTurn,
	startTurn,
	saveTurn,
	checkTurnVersion,
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

	const turn = await startTurn({ 
		userId: user.id, 
		worldId: world.id
	});

	return res.json({ 
		data: turn 
	});
};
//-----------------------------------------------------------------------------------------------//
export function showFinishTurn(req, res) {
	return res.render('game/world/turn/finish');
};
//-----------------------------------------------------------------------------------------------//
export async function handleFinishTurn(req, res) {
	const { user, world } = req.session;
	const { characterPhases } = req.validatedData;
	
	await saveTurn({ 
		userId: user.id, 
		worldId: world.id, 
		characterPhases 
	});
	
	return res.redirect('/game/world/menu');
};
//-----------------------------------------------------------------------------------------------//
export async function handleCheckTurnVersion(req, res) {
	const { user, world } = req.session;
	const { turnVersion } = req.validatedData;
	
	const valid = await checkTurnVersion({
		userId: user.id,
		worldId: world.id,
		turnVersion
	});
	
	if (!valid) {
		return res.json({
			redirect: '/game/world/turn/expired'
		});
	}

	return res.json({});
}
//-----------------------------------------------------------------------------------------------//
export function showTurnExpired(req, res) {
	return res.render('game/world/turn/expired');
};
//-----------------------------------------------------------------------------------------------//
export async function triggerProcessActions(req, res) {
	await processActions();
	
	return res.sendStatus(204);
};