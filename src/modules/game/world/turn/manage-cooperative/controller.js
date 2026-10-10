import { GameError } from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import { 
	reserveCooperativeName,
	cancelCooperativeName,
	getCooperative,
	getCharacter
} from './service.js';

//===============================================================================================//

export function showManageCooperative(req, res) {
	return res.render('game/world/turn/manage-cooperative');
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


//-----------------------------------------------------------------------------------------------//
export async function handleCancelCooperativeName(req, res) {
	const { user, world } = req.session;
	const { cooperativeId } = req.validatedData;
	
	await cancelCooperativeName({ 
		userId: user.id, 
		worldId: world.id, 
		cooperativeId
	});
	
	return res.json({});
}
//-----------------------------------------------------------------------------------------------//
export async function handleGetCooperative(req, res) {
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
export async function handleGetCharacter(req, res) {
	const { world } = req.session;
	const { firstName, lastName } = req.validatedData;

	try {
		const character = await getCharacter({ 
			worldId: world.id, 
			firstName,
			lastName
		});
		
		return res.json({ character });
	} catch (err) {
		if (err instanceof GameError) {
			return res.status(err.status).json({
				error: err.message
			});
		}

		throw err;
	}
}