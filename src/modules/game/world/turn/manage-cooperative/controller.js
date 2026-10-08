import { GameError } from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import { 
	getCooperative,
	reserveCooperativeName 
} from './service.js';

//===============================================================================================//

export function showManageCooperative(req, res) {
	return res.render('game/world/turn/manage-cooperative');
}
//-----------------------------------------------------------------------------------------------//
export async function handleGetCooperativeName(req, res) {
	const { world } = req.session;
	const { cooperativeName } = req.validatedData;

	try {
		const cooperative = await getCooperative({ 
			worldId: world.id, 
			cooperativeName
		});
		
		return res.json({ cooperative });
	} catch (err) {
		if (err instanceof GameError) {
			return res.status(err.status).json({
				error: err.message
			});
		}

		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function handleReserveCooperativeName(req, res) {
	const { user, world } = req.session;
	const { cooperativeName } = req.validatedData;

	try {
		const cooperative = await reserveCooperativeName({ 
			userId: user.id, 
			worldId: world.id, 
			cooperativeName
		});
		
		return res.json({ cooperative });
	} catch (err) {
		if (err instanceof GameError) {
			return res.status(err.status).json({
				error: err.message
			});
		}

		throw err;
	}
}