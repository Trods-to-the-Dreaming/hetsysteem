import knex from '#utils/db.js';
import { BadRequestError } from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import {
	findBuilding,
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
	findCharacterState,
	findCharacterBuildingsWithState,
	findCharacterBuildingsWithoutState,
	deleteCharacterBuilding,
	deleteUnusedCharacterBuilding,
	insertCharacterBuildingState,
	insertCharacterConstructionSite
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_DEMOLITION   = 'Dit gebouw kan niet worden gesloopt.';
const MSG_INVALID_CONSTRUCTION = 'Dit gebouw kan niet worden geplaatst.';
const MSG_INVALID_BUILDING	   = 'Dit type gebouw bestaat niet.';
const MSG_NOT_ENOUGH_TILES	   = 'Er zijn onvoldoende vrije landtegels.';

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
	const { constructionSiteId } = await findBuilding({
		slug: 'construction-site',
		trx
	});
	
	const actions = await listConstructActions(trx);
	for (const action of actions) {
		const {
			characterBuildingId,
			buildingId
		} = action;

		await insertCharacterBuildingState({
			characterBuildingId,
			buildingId: constructionSiteId,
			trx
		});

		await insertCharacterConstructionSite({
			characterBuildingId,
			targetBuildingId: buildingId,
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

	return {
		demolishActions,
		constructActions
	};
}
//-----------------------------------------------------------------------------------------------//
export async function saveManageBuildings({ characterId,
											manageBuildings,
											trx = knex }) {
	if (!manageBuildings)
		return;
	
	const { 
		demolishActions,
		constructActions 
	} = manageBuildings;
	
	// Validate
	if (demolishActions.length > 0) {
		const validDemolishActions = await findCharacterBuildingsWithState({
			characterId,
			characterBuildingIds: demolishActions.map((d) => d.characterBuildingId), 
			trx
		});
		if (validDemolishActions.length !== demolishActions.length)
			throw new BadRequestError(MSG_INVALID_DEMOLITION);
	}
	
	if (constructActions.length > 0) {
		const characterState = await findCharacterState({
			characterId,
			trx
		});

		const validConstructActions = await findCharacterBuildingsWithoutState({
			characterId,
			characterBuildingIds: constructActions.map((c) => c.characterBuildingId),
			trx
		});
		if (validConstructActions.length !== constructActions.length)
			throw new BadRequestError(MSG_INVALID_CONSTRUCTION);
		
		const totalSize = constructActions.reduce(
			(sum, item) => sum + item.size,
			0
		);
		if (totalSize > characterState.ownedTiles)
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
//-----------------------------------------------------------------------------------------------//
export async function reserveBuildingName({ userId, 
											worldId, 
											characterBuildingName }) {
	return knex.transaction(async (trx) => {
		const { id: characterId } = await findCharacter({
			userId,
			worldId,
			trx
		});
		
		let characterBuildingId;
		try {
			[characterBuildingId] = await insertCharacterBuilding({
				characterId,
				worldId,
				characterBuildingName,
				trx
			});
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY')
				throw new GameError(GAME_ERROR.BUILDING_NAME_TAKEN);
			
			throw err;
		}
		
		return { 
			characterBuildingId,
			characterBuildingName 
		};
	});
}
//-----------------------------------------------------------------------------------------------//
export async function cancelBuildingName({ userId, 
										   worldId, 
										   characterBuildingId }) {
	return await knex.transaction(async (trx) => {
		const { id: characterId } = await findCharacter({
			userId,
			worldId,
			trx
		});
		
		await deleteUnusedCharacterBuilding({
			characterBuildingId,
			characterId,
			trx
		});
	});
}