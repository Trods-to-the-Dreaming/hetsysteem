import knex from '#utils/db.js';

//===============================================================================================//

export function findTurnData({ characterId,
							   trx = knex }) {
	return trx('characters')
		.select({
			finished: 'has_finished_turn',
			isCharacterCustomized: 'is_customized'
		})
		.where('id', characterId)
		.first();
};
//-----------------------------------------------------------------------------------------------//


export function findCustomizeCharacter({ characterId,
										 trx = knex }) {
	return trx('action_customize')
		.select({
			id: 'id',
			firstName: 'first_name',
			lastName: 'last_name',
			jobPreference1: 'job_preference_1_id',
			jobPreference2: 'job_preference_2_id',
			jobPreference3: 'job_preference_3_id',
			recreationPreference: 'recreation_preference_id'
		})
		.where('character_id', characterId)
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function insertCustomizeCharacter({ action,
										   characterId,
										   trx = knex }) {
	await trx('action_customize')
		.where('character_id', characterId)
		.del();
	
	return trx('action_customize')
		.insert({
			character_id: characterId,
			first_name: action.firstName,
			last_name: action.lastName,
			job_preference_1_id: action.jobPreference1,
			job_preference_2_id: action.jobPreference2,
			job_preference_3_id: action.jobPreference3,
			recreation_preference_id: action.recreationPreference
		});
};
//-----------------------------------------------------------------------------------------------//
export function findDemolish({ characterId,
							   trx = knex }) {
	return trx('action_demolish as ad')
		.select({
			id: 'ad.character_building_id'
		})
		.innerJoin('character_buildings as cb', 'cb.id', 'ad.character_building_id')
		.where('cb.character_id', characterId)
};
//-----------------------------------------------------------------------------------------------//
export function findConstruct({ characterId,
							    trx = knex }) {
	return trx('action_construct')
		.select({
			name: 'name',
			buildingId: 'building_id',
			sizeFactor: 'size_factor'
		})
		.where('character_id', characterId)
};



export function findManageBuildings({ characterId,
									  trx = knex }) {
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
	
	return { demolish,
			 construct };
};