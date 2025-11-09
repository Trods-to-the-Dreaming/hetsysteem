//=== Imports ===================================================================================//
import knex from '#utils/db.js';
import { 
	BadRequestError
} from '#utils/errors.js';

import { 
	manageBuildingsSchema
} from '#validation/actions.validation.js';

import { 
	MSG_NOT_OWNED_BUILDING
} from '#constants/game.messages.js';

import {
	isBuildingNameAvailable,
	getCharacterBuildings
} from '#helpers/game/state.helpers.js';

//=== Main ======================================================================================//

//--- Get manage buildings ----------------------------------------------------------------------//
export const getManageBuildings = async (characterId,
										 trx = knex) => {
	const demolish = await trx('action_demolish as ad')
		.select(
			'ad.id as id',
			'cb.id as buildingId'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ad.building_id')
		.where('cb.owner_id', characterId)
	
	const construct = await trx('action_construct')
		.select(
			'id',
			'name',
			'building_id as buildingId',
			'size_factor as sizeFactor'
		)
		.where('owner_id', characterId)
	
	return { demolish,
			 construct };
};

//--- Set manage buildings ----------------------------------------------------------------------//
export const setManageBuildings = async (characterId,
										 action,
										 trx = knex) => {
	// Validate action
	const validatedAction = manageBuildingsSchema.safeParse(action);
	
	if (!validatedAction.success) {
		throw new BadRequestError(validatedAction.error.issues[0].message);
	}
	
	// Validate demolished buildings
	const ownedBuildings = await trx('character_buildings')
		.select('id')
		.where('owner_id', characterId)
		
	const ownedBuildingIds = new Set(ownedBuildings.map(b => b.id));
	const demolishedBuildingIds = validatedAction.demolish;
	
	if (!demolishedBuildingIds.every(id => ownedBuildingIds.has(id))) {
		throw new BadRequestError(MSG_NOT_OWNED_BUILDING);
	}
	
	// Validate constructed buildings
	const allBuildings = await getAllBuildings(trx);
	const constructedBuildingIds = validatedAction.construct.map(b => b.building_id);
	
	if (!constructedBuildingIds.every(id => allBuildings.has(id))) {
		throw new BadRequestError(MSG_INVALID_BUILDING);
	}
	
	const constructedBuildingNames = validatedAction.construct.map(b => b.name);
	
	if (new Set(constructedBuildingNames).size < constructedBuildingNames.length) {
		throw new BadRequestError(MSG_NO_UNIQUE_BUILDING_NAMES);
	}
	
	// Validate new building names
	for (const buildingName of constructedBuildingNames) {
		const available = await isBuildingNameAvailable(
			worldId, 
			buildingName, 
			trx
		);
		
		if (!available) {
			throw new ConflictError(MSG_BUILDING_NAME_TAKEN,
									{ type: 'building' });
		}
	}
	
	// Delete existing action
	await trx('action_demolish')
		.whereIn(
			'building_id',
			trx('character_buildings').select('id').where('owner_id', characterId)
		)
		.del();
	
	await trx('action_construct')
		.where('owner_id', characterId)
		.del();
	
	// Insert new action
	if (validatedAction.demolish.length > 0) {
		await trx('action_demolish').insert(
			validatedAction.demolish.map(id => ({ building_id: id }))
		);
	}
	
	if (validatedAction.construct.length > 0) {
		await trx('action_construct').insert(
			validatedAction.construct.map(b => ({ 
				owner_id: characterId,
				building_id: b.buildingId,
				name: b.name,
				size: b.size
			}))
		);
	}
};