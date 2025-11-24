//=== Imports ===================================================================================//

import knex from '#utils/db.js';
import { 
	BadRequestError,
	ConflictError
} from '#utils/errors.js';

import { 
	customizeCharacterSchema
} from '#validation/actions.validation.js';

import { 
	MSG_INVALID_CHARACTER,
	MSG_INVALID_JOB,
	MSG_INVALID_RECREATION,
	MSG_NO_UNIQUE_JOBS,
	MSG_CHARACTER_NAME_TAKEN
} from '#constants/game.messages.js';

import { 
	getBuildings,
	getRecreations
} from '#helpers/game/static.helpers.js';

import {
	findCharacterName
} from '#helpers/game/state.helpers.js';

//=== Main ======================================================================================//

export const getCustomizeCharacter = async (characterId,
											trx = knex) => {
	const actions = await trx('action_customize')
		.select(
			'id',
			'first_name as firstName',
			'last_name as lastName',
			'job_preference_1_id as jobPreference1',
			'job_preference_2_id as jobPreference2',
			'job_preference_3_id as jobPreference3',
			'recreation_preference_id as recreationPreference'
		)
		.where('character_id', characterId)
		.first();
	
	return actions;
};
//-----------------------------------------------------------------------------------------------//
export const setCustomizeCharacter = async (action,
											characterId,
											worldId,
											trx = knex) => {
	// Validate character
	const character = await trx('characters')
		.select(
			'is_customized as isCustomized'
		)
		.where('id', characterId)
		.first();
	
	if (!character) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	} else if (character.isCustomized) {
		return;
	}
	
	// Delete existing action
	await trx('action_customize')
		.where('character_id', characterId)
		.del();
	
	// Validate new action
	const validatedAction = customizeCharacterSchema.safeParse(action);
	
	if (!validatedAction.success) {
		throw new BadRequestError(validatedAction.error.issues[0].message);
	}
	
	// Validate job preferences
	const jobs = await getBuildings(trx);
	
	const jobPreferenceIds = [
		validatedAction.data.jobPreference1,
		validatedAction.data.jobPreference2,
		validatedAction.data.jobPreference3
	];
	
	if (!jobPreferenceIds.every(id => jobs.has(id))) {
		throw new BadRequestError(MSG_INVALID_JOB);
	}
	
	if (new Set(jobPreferenceIds).size < jobPreferenceIds.length) {
		throw new BadRequestError(MSG_NO_UNIQUE_JOBS);
	}
	
	// Validate recreation preferences
	const recreations = await getRecreations(trx);
	
	const recreationPreferenceId = validatedAction.data.recreationPreference;
	
	if (!recreations.has(recreationPreferenceId)) {
		throw new BadRequestError(MSG_INVALID_RECREATION);
	}
	
	// Validate new character name
	const duplicate = await findCharacterName(
		validatedAction.data.firstName,
		validatedAction.data.lastName,
		characterId,
		worldId,
		trx
	);
	
	if (duplicate) {
		throw new ConflictError(MSG_CHARACTER_NAME_TAKEN,
								{ type: 'character' });
	}
  
	// Insert new action
	await trx('action_customize')
		.insert({
			character_id: characterId,
			first_name: validatedAction.data.firstName,
			last_name: validatedAction.data.lastName,
			job_preference_1_id: validatedAction.data.jobPreference1,
			job_preference_2_id: validatedAction.data.jobPreference2,
			job_preference_3_id: validatedAction.data.jobPreference3,
			recreation_preference_id: validatedAction.data.recreationPreference
		});
};