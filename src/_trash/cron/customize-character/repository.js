import knex from '#utils/db.js';

//===============================================================================================//

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
export function updateCharacter({ characterId, 
								  firstName,
								  lastName,
								  jobPreference1Id,
								  jobPreference2Id,
								  jobPreference3Id,
								  recreationPreferenceId,
								  trx = knex }) {
	return trx('characters')
		.where('id', characterId)
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
//-----------------------------------------------------------------------------------------------//
export function deleteCustomizeAction({ characterId,
										trx = knex }) {
	return trx('action_customize')
		.where('character_id', characterId)
		.del();
}