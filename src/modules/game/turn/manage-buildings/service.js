import knex from '#utils/db.js';
import { 
	BadRequestError
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GameError 
} from '#modules/game/errors.js';
import { 
	GAME 
} from '#modules/game/reasons.js';

import { 
	listDemolishActions,
	listConstructActions,
	findDemolishActions,
	findConstructActions,
	deleteConstructAction,
	deleteDemolishActions,
	deleteConstructActions,
	insertDemolishActions,
	insertConstructActions,
	findCharacter,
	findCharacterBuildingsWithState,
	findCharacterBuildingsWithoutState,
	deleteCharacterBuilding,
	insertCharacterBuildingState,
	insertCharacterConstructionSite
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_CHARACTER_BUILDING = 'Het personage bezit dit gebouw niet.';
const MSG_INVALID_BUILDING			 = 'Dit type gebouw bestaat niet.';
const MSG_NOT_ENOUGH_TILES			 = 'Er zijn onvoldoende vrije landtegels.';

//===============================================================================================//

async function processDemolishActions(trx) {
	const actions = await listDemolishActions(trx);
	for (const action of actions) {
		const { characterBuildingId } = action;
		
		await deleteCharacterBuilding({
			characterBuildingId,
			trx
		}); // CASCADE also deletes the action
	}
}
//-----------------------------------------------------------------------------------------------//
async function processConstructActions(trx) {
	const { constructionSiteId } = await findBuildingId({
		slug: 'construction-site',
		trx
	});
	
	const actions = await listConstructActions(trx);
	for (const action of actions) {
		const {
			characterBuildingId,
			buildingId,
			size
		} = action;

		await insertCharacterBuildingState({
			characterBuildingId,
			buildingId: constructionSiteId,
			size,
			trx
		});

		await insertCharacterConstructionSite({
			characterBuildingId,
			buildingId,
			bricksNeeded: size, // eventueel maal een constante factor
			trx
		});

		await deleteConstructAction({ 
			characterBuildingId, 
			trx 
		});
	}
}

//===============================================================================================//

export async function loadManageBuildings({ characterId,
											trx = knex }) {
	const demolishActions = await findDemolishActions({
		characterId,
		trx
	});
	
	const constructActions = await findConstructActions({
		characterId,
		trx
	});

	if (demolishActions.length === 0 && constructActions.length === 0) {
		return undefined;
	}

	return {
		demolishActions,
		constructActions
	};
}
//-----------------------------------------------------------------------------------------------//
export async function saveManageBuildings({ characterId,
											phase,
											trx = knex }) {
	if (!phase)
		return;
	
	const { 
		demolishActions,
		constructActions 
	} = phase;
	
	// Validate
	if (demolishActions.length > 0) {
		const validDemolishActions = await findCharacterBuildingsWithState({
			characterId,
			characterBuildingIds: demolishActions.map(d => d.characterBuildingId), 
			trx
		});
		if (validDemolishActions.length !== demolishActions.length)
			throw new BadRequestError(MSG_INVALID_CHARACTER_BUILDING);
	}
	
	if (constructActions.length > 0) {
		const character = await findCharacter({
			characterId,
			trx
		});

		const validConstructActions = await findCharacterBuildingsWithoutState({
			characterId,
			characterBuildingIds: constructActions.map(c => c.characterBuildingId),
			trx
		});
		if (validConstructActions.length !== constructActions.length)
			throw new BadRequestError(MSG_INVALID_CHARACTER_BUILDING);
		
		const totalSize = constructActions.reduce(
			(sum, item) => sum + item.size,
			0
		);
		if (totalSize > character.ownedTiles)
			throw new BadRequestError(MSG_NOT_ENOUGH_TILES);	
	}
	
	// Delete
	await deleteDemolishActions({
		characterId,
		trx
	});
	
	await deleteConstructActions({
		characterId,
		trx
	});
	
	// Insert
	if (demolishActions.length > 0) {
		await insertDemolishActions({
			demolishActions,
			trx
		});
	}
	
	if (constructActions.length > 0) {
		try {
			await insertConstructActions({
				constructActions,
				trx
			});
		} catch (err) {
			if (err.code === 'ER_NO_REFERENCED_ROW_2') {
				throw new BadRequestError(MSG_INVALID_BUILDING);
			}
			
			throw err;
		}
	}
}
//-----------------------------------------------------------------------------------------------//
export async function processManageBuildings(trx) {
	await processDemolishActions(trx);
	await processConstructActions(trx);
}