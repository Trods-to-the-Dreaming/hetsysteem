//=== Imports ===================================================================================//

import knex from '#utils/db.js';
import { 
	BadRequestError,
	ConflictError
} from '#utils/errors.js';

import { 
	manageBuildingsSchema
} from '#validation/actions.validation.js';

import { 
	MSG_NOT_OWNED_BUILDING,
	MSG_INVALID_BUILDING,
	MSG_NO_UNIQUE_BUILDING_NAMES,
	MSG_BUILDING_NAME_TAKEN
} from '#constants/game.messages.js';

import { 
	getBuildings
} from '#helpers/game/static.helpers.js';

import {
	findBuildingName
} from '#helpers/game/state.helpers.js';

//=== Main ======================================================================================//

export const getManageBuildings = async (characterId,
										 trx = knex) => {
	const undo = await trx('action_undo as au')
		.select(
			'au.character_building_id as id'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'au.character_building_id')
		.where('cb.character_id', characterId)
		
	const demolish = await trx('action_demolish as ad')
		.select(
			'ad.character_building_id as id'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ad.character_building_id')
		.where('cb.character_id', characterId)
	
	const construct = await trx('action_construct')
		.select(
			'name',
			'building_id as buildingId',
			'size_factor as sizeFactor'
		)
		.where('character_id', characterId)
	
	return { undo,
			 demolish,
			 construct };
};
//-----------------------------------------------------------------------------------------------//
export const setManageBuildings = async (action,
										 characterId, 
										 worldId,
										 trx = knex) => {
	// Delete existing action
	await trx('action_demolish')
		.whereIn(
			'building_id',
			trx('character_buildings').select('id').where('character_id', characterId)
		)
		.del();
	
	await trx('action_construct')
		.where('character_id', characterId)
		.del();
	
	// Validate action
	const validatedAction = manageBuildingsSchema.safeParse(action);
	
	if (!validatedAction.success) {
		throw new BadRequestError(validatedAction.error.issues[0].message);
	}
	
	// Validate demolished buildings
	const ownedBuildings = await trx('character_buildings')
		.select('id')
		.where('character_id', characterId)
		
	const ownedBuildingIds = new Set(ownedBuildings.map(b => b.id));
	const demolishedBuildingIds = validatedAction.data.demolish;
	
	if (!demolishedBuildingIds.every(id => ownedBuildingIds.has(id))) {
		throw new BadRequestError(MSG_NOT_OWNED_BUILDING);
	}
	
	// Validate constructed buildings
	const buildings = await getBuildings(trx);
	const constructedBuildingIds = validatedAction.data.construct.map(b => b.buildingId);
	
	if (!constructedBuildingIds.every(id => buildings.has(id))) {
		throw new BadRequestError(MSG_INVALID_BUILDING);
	}
	
	const constructedBuildingNames = validatedAction.data.construct.map(b => b.name);
	
	if (new Set(constructedBuildingNames).size < constructedBuildingNames.length) {
		throw new BadRequestError(MSG_NO_UNIQUE_BUILDING_NAMES);
	}
	
	// Validate new building names
	for (const buildingName of constructedBuildingNames) {
		const duplicate = await findBuildingName(
			buildingName, 
			worldId, 
			trx
		);
		
		if (duplicate) {
			throw new ConflictError(MSG_BUILDING_NAME_TAKEN,
									{ type: 'building' });
		}
	}
	
	// Insert new action
	if (validatedAction.data.demolish.length > 0) {
		await trx('action_demolish').insert(
			validatedAction.data.demolish.map(id => ({ building_id: id }))
		);
	}
	
	if (validatedAction.data.construct.length > 0) {
		await trx('action_construct').insert(
			validatedAction.data.construct.map(b => ({ 
				owner_id: characterId,
				building_id: b.buildingId,
				name: b.name,
				size_factor: b.sizeFactor
			}))
		);
	}
};