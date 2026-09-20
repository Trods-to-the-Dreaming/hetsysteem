import { GameError } from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import { 
	loadTurn,
	saveTurn,
	processTurn 
} from './service.js';

//===============================================================================================//

export async function handleLoadTurn(req, res) {
	const { user, world } = req.session;

	try {
		const turn = await loadTurn({ 
			userId: user.id, 
			worldId: world.id
		});
		
		return res.json({
			data: turn
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
export async function handleSaveTurn(req, res) {
	const { user, world } = req.session;
	const { actions } = req.validatedData;
	
	try {
		await saveTurn({ 
			userId: user.id, 
			worldId: world.id,
			actions
		});
		
		return res.sendStatus(204);
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
export async function triggerProcessTurn(req, res) {
	await processTurn();
	
	return res.sendStatus(204);
};