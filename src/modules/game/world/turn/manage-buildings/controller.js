import { GameError } from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import { 
	reserveBuildingName,
	cancelBuildingName
} from './service.js';

//===============================================================================================//

export function showManageBuildings(req, res) {
	return res.render('game/world/turn/manage-buildings');
};
//-----------------------------------------------------------------------------------------------//
export async function handleReserveBuildingName(req, res) {
	const { user, world } = req.session;
	const { characterBuildingName } = req.validatedData;

	try {
		const characterBuilding = await reserveBuildingName({ 
			userId: user.id, 
			worldId: world.id, 
			characterBuildingName 
		});
		
		return res.json({ 
			data: characterBuilding
		});
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
export async function handleCancelBuildingName(req, res) {
	const { user, world } = req.session;
	const { characterBuildingId } = req.validatedData;
	
	await cancelBuildingName({ 
		userId: user.id, 
		worldId: world.id, 
		characterBuildingId
	});
	
	return res.json({});
}