import knex from '#utils/db.js';

//===============================================================================================//

export function listJobs(trx = knex) {
	return trx('buildings')
		.select({
			id: 'id',
			type: 'job'
		})
		.orderBy('id');
}
//-----------------------------------------------------------------------------------------------//
export function listRecreations(trx = knex) {
	return trx('recreations as r')
		.select({
			id: 'r.product_id',
			type: 'p.type'
		})
		.innerJoin('products as p', 'r.product_id', 'p.id')
		.orderBy('id');
};
//-----------------------------------------------------------------------------------------------//
export function findCharacterName({ userId,
									worldId,
									trx = knex }) {
	return trx('character_names')
		.select({ id: 'id' })
		.where({
			user_id: userId,
			world_id: worldId
		})
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function lockCharacterName({ userId,
									worldId,
									trx = knex }) {
	return trx('character_names')
		.select({ id: 'id' })
		.where({
			user_id: userId,
			world_id: worldId
		})
		.forUpdate()
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterName({ userId,
									  worldId,
									  firstName,
									  lastName,
									  trx = knex }) {
	return trx('character_names').insert({
			user_id: userId,
			world_id: worldId,
			first_name: firstName,
			last_name: lastName
		});
}
//-----------------------------------------------------------------------------------------------//
export function updateCharacterName({ characterNameId,
									  firstName,
									  lastName,
									  trx = knex }) {
	return trx('character_names')
		.where({ id: characterNameId })
		.update({
			first_name: firstName,
			last_name: lastName
		});
}
//-----------------------------------------------------------------------------------------------//
export function findCreateCharacterAction({ characterNameId,
											trx = knex }) {
    return trx('action_create_character')
        .select({
			jobPreference1Id: 'job_preference_1_id',
			jobPreference2Id: 'job_preference_2_id',
			jobPreference3Id: 'job_preference_3_id',
            recreationPreferenceId: 'recreation_preference_id'
		})
		.where({ character_name_id: characterNameId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function insertCreateCharacterAction({ characterNameId, 
											  jobPreference1Id, 
											  jobPreference2Id, 
											  jobPreference3Id, 
											  recreationPreferenceId, 
											  trx = knex }) {
    return trx('action_create_character')
        .insert({
            character_name_id: characterNameId,
            job_preference_1_id: jobPreference1Id,
            job_preference_2_id: jobPreference2Id,
            job_preference_3_id: jobPreference3Id,
            recreation_preference_id: recreationPreferenceId
        });
}