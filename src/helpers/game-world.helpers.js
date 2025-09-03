//=== Imports ===================================================================================//
import knex from '../utils/db.js';
import { 
	BadRequestError, 
	ConflictError 
} from '../utils/errors.js';

import {
	MSG_INVALID_WORLD,
	MSG_NO_CHARACTER_CLAIMED/*,
	MSG_INVALID_CHARACTER,
	MSG_INVALID_NAME,
	MSG_INVALID_JOB,
	MSG_INVALID_RECREATION,
	MSG_ALREADY_CUSTOMIZED*/
} from '../constants/game.messages.js';

import { 
	getAllWorlds/*,
	getAllJobs,
	getAllRecreations*/
} from './game-static.helpers.js';

//=== Main ======================================================================================//

//--- Get world ---------------------------------------------------------------------------------//
export const getWorld = async (id, 
							   trx = knex) => {
	const world = (await getAllWorlds(trx)).get(Number(id));
	if (!world) {
		throw new BadRequestError(MSG_INVALID_WORLD);
	}
	return world;
};

//--- Find the user's character -----------------------------------------------------------------//
export const findUserCharacter = async (userId, 
										worldId, 
										trx = knex) => {
	const character = await trx('characters')
		.select(
			'id',
			'first_name as firstName',
			'last_name as lastName',
			'is_customized as isCustomized'
		)
		.where('user_id', userId)
		.andWhere('world_id', worldId)
		.first();
	
	return character || null;
};

//--- Claim an AI-character ---------------------------------------------------------------------//
export const claimAICharacter = async (userId, 
									   worldId, 
									   trx = knex) => {
	// Find an AI-character
	const freeCharacter = await trx('characters')
		.select('id')
		.where('user_id', null)
		.andWhere('world_id', worldId)
		.forUpdate()
		.first();
	if (!freeCharacter) {
		return null;
	}
	const characterId = freeCharacter.id;

	// Claim the AI-character
	const updatedRows = await trx('characters')
		.where('id', characterId)
		.andWhere('user_id', null)
		.update({
			user_id: userId,
			is_customized: false
		});
	if (updatedRows !== 1) {
		throw new ConflictError(MSG_NO_CHARACTER_CLAIMED);
	}
	
	// Get the claimed character
	const character = await trx('characters')
		.select(
			'id', 
			'first_name as firstName', 
			'last_name as lastName', 
			'is_customized as isCustomized'
		)
		.where('id', characterId)
		.first();
	return character;
};
/*
//--- Validate character id ---------------------------------------------------------------------//
export const validateCharacterId = async (characterId, 
										  trx = knex) => {
	const character = await trx('characters')
		.select('id')
		.where({ 'id': characterId })
		.first();
	if (!character) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
};

//--- Validate name -----------------------------------------------------------------------------//
export const validateName = async (firstName,
								   lastName,
								   trx = knex) => {
	if (!isValidName(firstName) ||
		!isValidName(lastName)) {
		throw new BadRequestError(MSG_INVALID_NAME);
	}
};

//--- Validate job preferences ------------------------------------------------------------------//
export const validateJobPreferences = async (jobPreference1,
											 jobPreference2,
											 jobPreference3,
											 trx = knex) => {
	// Check if the job preferences exist
	const validJobs = await getAllJobs(trx);	
	const jobPreferences = [jobPreference1, jobPreference2, jobPreference3];
	for (const jobPreference of jobPreferences) {
		const jobId = Number(jobPreference);
		if (!validJobs.has(jobId)) {
			throw new BadRequestError(MSG_INVALID_JOB);
		}
	}
			
	// Check if the job preferences are unique
	const uniqueJobs = new Set(jobPreferences);
	if (uniqueJobs.size !== jobPreferences.length) {
		throw new BadRequestError(MSG_NO_UNIQUE_JOBS);
	}
};

//--- Validate recreation preference ------------------------------------------------------------//
export const validateRecreationPreference = async (recreationPreference,
												   trx = knex) => {
	// Check if the recreation preference exists
	const validRecreations = await getAllRecreations(trx);
	const recreationId = Number(recreationPreference);
	if (!validRecreations.has(recreationId)) {
		throw new BadRequestError(MSG_INVALID_RECREATION);
	}
};

//--- Is character name taken? ------------------------------------------------------------------//
export const isCharacterNameTaken  = async (selfId,
											worldId, 
											firstName, 
											lastName,
											trx = knex) => {
	const duplicate = await trx('characters')
		.select(1)
		.where('id', '!=', selfId)
		.andWhere('world_id', worldId)
		.andWhereRaw('LOWER(first_name) = ?', firstName.toLowerCase())
		.andWhereRaw('LOWER(last_name) = ?', lastName.toLowerCase())
		.first();
	return !!duplicate;
};

//--- Customize character -----------------------------------------------------------------------//
export const customizeCharacter = async (characterId,
										 firstName,
										 lastName,
										 jobPreference1,
										 jobPreference2,
										 jobPreference3,
										 recreationPreference,
										 trx = knex) => {
	const updatedRows = await trx('characters')
		.where({
			'id': characterId,
			is_customized: false
		})
		.update({ 
			first_name: firstName, 
		    last_name: lastName, 
		    job_preference_1_id: jobPreference1, 
		    job_preference_2_id: jobPreference2, 
		    job_preference_3_id: jobPreference3, 
		    recreation_preference_id: recreationPreference, 
		    is_customized: true
		});
	if (updatedRows !== 1) {
		throw new ConflictError(MSG_ALREADY_CUSTOMIZED);
	}
};

//=== Extra =====================================================================================//

//--- Is valid name? ----------------------------------------------------------------------------//
function isValidName(name) {
	// Wrong type
	if (typeof name !== 'string') return false;
	
	// Spaces at the beginning or the end
	if (name !== name.trim()) return false;

	// Too short or too long
	if (name.length < 2 || name.length > 32) return false;
	
	// Invalid characters
	const validChars = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+)*$/;
	return validChars.test(name);
}
*/