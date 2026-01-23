import knex from '#utils/db.js';
import { 
	BadRequestError 
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	findCharacter,
	findOwnedBuildings,
	findBuildings,
	listDemolishActions,
	listConstructActions,
	findDemolishActions,
	findConstructActions,
	upsertDemolishActions,
	upsertConstructActions,
	deleteDemolishAction,
	deleteConstructAction,
	deleteCharacterBuilding,
	insertCharacterBuilding,
	insertCharacterConstructionSite
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_CHARACTER	 = 'Dit personage bestaat niet.';
const MSG_INVALID_WORLD		 = 'Deze wereld bestaat niet.';
const MSG_NOT_OWNED_BUILDING = 'Het personage bezit dit gebouw niet.';
const MSG_NOT_ENOUGH_TILES	 = 'Er zijn onvoldoende vrije landtegels.';
const MSG_INVALID_BUILDING	 = 'Dit type gebouw bestaat niet.';

//===============================================================================================//

async function processDemolishActions({ trx = knex }) {
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
async function processConstructActions({ trx = knex }) {
	const constructionSiteId = await findBuildingId({
		slug: 'construction-site',
		trx
	});
	
	const actions = await listConstructActions(trx);
	for (const action of actions) {
		const {
			id: actionId
			worldId,
			characterId,
			buildingId,
			name,
			size
		} = action;
		
		const [characterBuildingId] = await insertCharacterBuilding({
			worldId,
			characterId,
			buildingId: constructionSiteId,
			name,
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
			actionId, 
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
											worldId,
											phase,
											trx = knex }) {
	// Check character
	const character = await findCharacter({
		characterId,
		trx
	});
	if (!character) 
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	
	// Check world
	if (worldId !== character.worldId)
		throw new BadRequestError(MSG_INVALID_WORLD);
	
	// Check phase
	if (!phase)
		return;
	
	const { 
		demolishActions,
		constructActions 
	} = phase;
	
	// Check demolish actions
	const ownedBuildings = await findOwnedBuildings({
		demolishActions, 
		trx
	});
	if (ownedBuildings.length !== demolishActions.length)
		throw new BadRequestError(MSG_NOT_OWNED_BUILDING);
	
	// Check construct actions
	const totalSize = constructActions.reduce(
		(sum, item) => sum + item.size,
		0
	);
	if (totalSize > character.ownedTiles)
		throw new BadRequestError(MSG_NOT_ENOUGH_TILES);
	
	const newBuildings = constructActions.map(c => c.buildingId);
	const validBuildings = await findBuildings({
		buildingIds,
		trx
	});
	if (validBuildings.length !== newBuildings.length)
		throw new BadRequestError(MSG_INVALID_BUILDING);
	
	// Save demolish actions
	await deleteDemolishActions({
		characterId,
		trx
	});
	
	await insertDemolishActions({
		demolishActions,
		trx
	});
	
	// Save construct actions
	await upsertConstructActions({
		characterId,
		worldId,
		constructActions,
		trx
	});
}
//-----------------------------------------------------------------------------------------------//
export async function processManageBuildings(trx) {
	await processDemolishActions(trx);
	await processConstructActions(trx);
}