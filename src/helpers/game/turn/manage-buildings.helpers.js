//=== Imports ===================================================================================//
import knex from '#utils/db.js';

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
										 trx = knex) => {
	
};