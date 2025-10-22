//=== Imports ===================================================================================//
import knex from '#utils/db.js';
import { 
	BadRequestError,
	ConflictError
} from '#utils/errors.js';

import { 
	MSG_INVALID_CHARACTER,
	MSG_CHARACTER_NAME_TAKEN,
	MSG_EMPTY_FIELD,
	MSG_INVALID_JOB,
	MSG_INVALID_RECREATION,
	MSG_NO_UNIQUE_JOBS
} from '#constants/game.messages.js';

import { 
	getAllRecreations,
	getAllJobs
} from '#helpers/game/static.helpers.js';

import {
	isCharacterNameAvailable
} from '#helpers/game/state.helpers.js';

//=== Main ======================================================================================//

//--- Get customize character -------------------------------------------------------------------//
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

//--- Set customize character -------------------------------------------------------------------//
export const setCustomizeCharacter = async (characterId,
											worldId,
											action,
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
	
	// Validate character name
	const available = await isCharacterNameAvailable(
		characterId,
		worldId, 
		action.firstName, 
		action.lastName
	);
	
	if (!available) {
		throw new ConflictError(MSG_CHARACTER_NAME_TAKEN,
								{ type: 'character' });
	}
	
	// Validate action
	if (!action.firstName ||
		!action.lastName ||
		!action.jobPreference1 ||
		!action.jobPreference2 ||
		!action.jobPreference3 ||
		!action.recreationPreference) {
		throw new BadRequestError(MSG_EMPTY_FIELD);
	}
	
	const [
		allJobs,
		allRecreations,
	] = await Promise.all([
		getAllJobs(trx),
		getAllRecreations(trx)
	]);
	
	const jobIds = [
		Number(action.jobPreference1),
		Number(action.jobPreference2),
		Number(action.jobPreference3)
	];
	
	if (!jobIds.every(id => allJobs.has(id))) {
		throw new BadRequestError(MSG_INVALID_JOB);
	}
	
	const recreationId = Number(action.recreationPreference);
	
	if (!allRecreations.has(recreationId)) {
		throw new BadRequestError(MSG_INVALID_RECREATION);
	}
	
	if (new Set(jobIds).size < jobIds.length) {
		throw new BadRequestError(MSG_NO_UNIQUE_JOBS);
	}
	
	// Delete existing action
	await trx('action_customize')
		.where('character_id', characterId)
		.del();
  
	// Insert new action
	await trx('action_customize')
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