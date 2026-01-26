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
export function findCharacter({ userId,
								worldId,
								trx = knex }) {
	return trx('characters')
		.select({ 
			id: 'id',
			firstName: 'first_name',
			lastName: 'last_name'
		})
		.where({
			user_id: userId,
			world_id: worldId
		})
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function lockCharacter({ userId,
								worldId,
								trx = knex }) {
	return trx('characters')
		.select({ id: 'id' })
		.where({
			user_id: userId,
			world_id: worldId
		})
		.forUpdate()
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacter({ userId,
								  worldId,
								  firstName,
								  lastName,
								  trx = knex }) {
	return trx('characters').insert({
			user_id: userId,
			world_id: worldId,
			first_name: firstName,
			last_name: lastName
		});
}
//-----------------------------------------------------------------------------------------------//
export function updateCharacter({ characterId,
								  firstName,
								  lastName,
								  trx = knex }) {
	return trx('characters')
		.where({ id: characterId })
		.update({
			first_name: firstName,
			last_name: lastName
		});
}
//-----------------------------------------------------------------------------------------------//
export function findActionCreateCharacter({ characterId,
											trx = knex }) {
    return trx('actions_create_character')
        .select({
			jobPreference1Id: 'job_preference_1_id',
			jobPreference2Id: 'job_preference_2_id',
			jobPreference3Id: 'job_preference_3_id',
            recreationPreferenceId: 'recreation_preference_id'
		})
		.where({ character_id: characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function upsertActionCreateCharacter({ characterId, 
											  jobPreference1Id, 
											  jobPreference2Id, 
											  jobPreference3Id, 
											  recreationPreferenceId, 
											  trx = knex }) {
    return trx('actions_create_character')
        .insert({
            character_id: characterId,
            job_preference_1_id: jobPreference1Id,
            job_preference_2_id: jobPreference2Id,
            job_preference_3_id: jobPreference3Id,
            recreation_preference_id: recreationPreferenceId
        })
		.onConflict('character_id')
		.merge({
			job_preference_1_id: jobPreference1Id,
			job_preference_2_id: jobPreference2Id,
			job_preference_3_id: jobPreference3Id,
			recreation_preference_id: recreationPreferenceId
		});
}
//-----------------------------------------------------------------------------------------------//
export function listActionsCreateCharacter(trx = knex) {
	return trx('actions_create_character')
		.select({
			characterId: 'character_id',
			jobPreference1Id: 'job_preference_1_id',
			jobPreference2Id: 'job_preference_2_id',
			jobPreference3Id: 'job_preference_3_id',
			recreationPreferenceId: 'recreation_preference_id'
		});
}
//-----------------------------------------------------------------------------------------------//
export function deleteActionCreateCharacter({ characterId,
											  trx = knex }) {
	return trx('actions_create_character')
		.where({ character_id: characterId })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterState({ characterId, 
									   jobPreference1Id, 
									   jobPreference2Id, 
									   jobPreference3Id, 
									   recreationPreferenceId, 
									   trx = knex }) {
    return trx('character_states')
        .insert({
            character_id: characterId,
            job_preference_1_id: jobPreference1Id,
            job_preference_2_id: jobPreference2Id,
            job_preference_3_id: jobPreference3Id,
            recreation_preference_id: recreationPreferenceId
        });
}