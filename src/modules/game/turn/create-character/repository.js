import knex from '#utils/db.js';

//===============================================================================================//

export function findCharacter({ characterId,
								trx = knex }) {
	return trx('characters')
		.select({ isCustomized: 'is_customized' })
		.where({ character_id: characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findJobs({ jobIds, 
						   trx = knex }) {
	return trx('buildings')
		.select(1)
		.whereIn('id', jobIds);
}
//-----------------------------------------------------------------------------------------------//
export function findRecreation({ recreationId, 
								 trx = knex }) {
	return trx('recreations')
		.select(1)
		.where({ product_id: recreationId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function listCustomizeActions(trx = knex) {
	return trx('action_customize')
		.select({
			characterId: 'character_id',
			firstName: 'first_name',
			lastName: 'last_name',
			jobPreference1Id: 'job_preference_1_id',
			jobPreference2Id: 'job_preference_2_id',
			jobPreference3Id: 'job_preference_3_id',
			recreationPreferenceId: 'recreation_preference_id'
		});
}
//-----------------------------------------------------------------------------------------------//
export function findCustomizeAction({ characterId, 
									  trx = knex }) {
	return trx('action_customize')
		.select({
			firstName: 'first_name',
			lastName: 'last_name',
			jobPreference1: 'job_preference_1',
			jobPreference2: 'job_preference_2',
			jobPreference3: 'job_preference_3',
			recreationPreference: 'recreation_preference'
		})
		.where({ character_id: characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function deleteCustomizeAction({ characterId,
										trx = knex }) {
	return trx('action_customize')
		.where({ character_id: characterId })
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function insertCustomizeAction({ characterId,
										firstName,
										lastName,
										jobPreference1,
										jobPreference2,
										jobPreference3,
										recreationPreference,
										trx = knex }) {
	return trx('action_customize')
		.insert({
			character_id: characterId,
			first_name: firstName,
			last_name: lastName,
			job_preference_1: jobPreference1,
			job_preference_2: jobPreference2,
			job_preference_3: jobPreference3,
			recreation_preference: recreationPreference
		});
}
//-----------------------------------------------------------------------------------------------//
export function updateCharacter({ characterId, 
								  firstName,
								  lastName,
								  jobPreference1Id,
								  jobPreference2Id,
								  jobPreference3Id,
								  recreationPreferenceId,
								  trx = knex }) {
	return trx('characters')
		.where({ id: characterId })
		.update({
			first_name: firstName,
			last_name: lastName,
			job_preference_1_id: jobPreference1Id,
			job_preference_2_id: jobPreference2Id,
			job_preference_3_id: jobPreference3Id,
			recreation_preference_id: recreationPreferenceId,
			is_customized: true
		});
}