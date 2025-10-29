//=== Imports ===================================================================================//
import knex from '#utils/db.js';

import {
	isCharacterNameAvailable
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
			'size'
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
	if (!action.firstName ||
		!action.lastName ||
		!action.jobPreference1 ||
		!action.jobPreference2 ||
		!action.jobPreference3 ||
		!action.recreationPreference) {
		throw new BadRequestError(MSG_EMPTY_FIELD);
	}
	
	// Validate demolished buildings
	const ownedBuildings = await trx('character_buildings')
		.select('id')
		.where('owner_id', characterId)
	
	const ownedIds = ownedBuildings.map(b => b.id);
	const invalidIds = action.demolish.filter(id => !ownedIds.includes(id));

	if (invalidIds.length > 0) {
		throw new BadRequestError(`Ongeldige gebouwen: ${invalidIds.join(', ')}`);
	}
	
	
	
	// Validate building names
	const available = await isBuildingNameAvailable(
		characterId,
		worldId, 
		action.firstName, 
		action.lastName
	);
	
};