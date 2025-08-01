//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	BadRequestError, 
	ConflictError 
} from "../utils/errors.js";

import {
	MSG_INVALID_WORLD,
	MSG_INVALID_CHARACTER,
	MSG_INVALID_NAME,
	MSG_INVALID_JOB,
	MSG_INVALID_RECREATION,
	MSG_NO_CHARACTER_CLAIMED,
	MSG_ALREADY_CUSTOMIZED
} from "../constants/game.messages.js";

import { 
	getAllWorlds,
	getAllJobs,
	getAllRecreations
} from "./game-static.helpers.js";

//=== Main ======================================================================================//

//--- Get world ---------------------------------------------------------------------------------//
export const getWorld = async (id, 
							   connection = db) => {
	const world = (await getAllWorlds(connection)).get(Number(id));
	if (!world) {
		throw new BadRequestError(MSG_INVALID_WORLD);
	}
	return world;
};

//--- Find the user's character -----------------------------------------------------------------//
export const findUserCharacter = async (userId, 
										worldId, 
										connection = db) => {
	const [[character]] = await connection.execute(
		`SELECT id,
				first_name,
				last_name,
				is_customized
		 FROM characters 
		 WHERE user_id = ? AND
			   world_id = ?`,
		[userId, 
		 worldId]
	);
	return character || null;
};

//--- Claim an AI-character ---------------------------------------------------------------------//
export const claimAICharacter = async (userId, 
									   worldId, 
									   connection = db) => {
	// Find an AI-character
	const [[freeCharacter]] = await connection.execute(
		`SELECT id 
		 FROM characters 
		 WHERE user_id IS NULL AND
			   world_id = ? 
		 LIMIT 1
		 FOR UPDATE`,
		[worldId]
	);
	if (!freeCharacter) {
		return null;
	}
	const characterId = freeCharacter.id;

	// Claim the AI-character
	const [updateResult] = await connection.execute(
		`UPDATE characters 
		 SET user_id = ?,
			 is_customized = false
		 WHERE id = ? AND
			   user_id IS NULL`,
		[userId, 
		 characterId]
	);
	if (updateResult.affectedRows !== 1) {
		throw new ConflictError(MSG_NO_CHARACTER_CLAIMED);
	}
	
	// Get the claimed character
	const [[character]] = await connection.execute(
		`SELECT id,
				first_name,
				last_name,
				is_customized
		 FROM characters
		 WHERE id = ?`,
		[characterId]
	);
	return character;
};

//--- Validate character id ---------------------------------------------------------------------//
export const validateCharacterId = async (characterId, 
										  connection = db) => {
	const [[character]] = await connection.execute(
		`SELECT id
		 FROM characters
		 WHERE id = ?`,
		[characterId]
	);
	if (!character) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
};

//--- Validate name -----------------------------------------------------------------------------//
export const validateName = async (firstName,
								   lastName,
								   connection = db) => {
	if (!isValidName(firstName) ||
		!isValidName(lastName)) {
		throw new BadRequestError(MSG_INVALID_NAME);
	}
};

//--- Validate job preferences ------------------------------------------------------------------//
export const validateJobPreferences = async (jobPreference1,
											 jobPreference2,
											 jobPreference3,
											 connection = db) => {
	// Check if the job preferences exist
	const validJobs = await getAllJobs(connection);	
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
												   connection = db) => {
	// Check if the recreation preference exists
	const validRecreations = await getAllRecreations(connection);
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
											connection = db) => {
	const [[duplicate]] = await connection.execute(
		`SELECT 1
		 FROM characters
		 WHERE id != ? AND
			   world_id = ? AND
			   LOWER(first_name) = LOWER(?) AND 
			   LOWER(last_name) = LOWER(?)
		 LIMIT 1`,
		[selfId,
		 worldId,
		 firstName, 
		 lastName]
	);
	console.log("selfId: " + selfId);
	console.log("worldId: " + worldId);
	console.log("firstName: " + firstName);
	console.log("lastName: " + lastName);
	console.log("duplicate: " + duplicate);
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
										 connection = db) => {
	const [updateResult] = await connection.execute(
		`UPDATE characters
		 SET first_name = ?, 
		     last_name = ?, 
		     job_preference_1_id = ?, 
		     job_preference_2_id = ?, 
		     job_preference_3_id = ?, 
		     recreation_preference_id = ?, 
		     is_customized = true
		 WHERE id = ? AND
			   is_customized = false`,
		[firstName,
		 lastName,
		 jobPreference1,
		 jobPreference2,
		 jobPreference3,
		 recreationPreference,
		 characterId]
	);
	if (updateResult.affectedRows !== 1) {
		throw new ConflictError(MSG_ALREADY_CUSTOMIZED);
	}
};

//=== Extra =====================================================================================//

//--- Is valid name? ----------------------------------------------------------------------------//
function isValidName(name) {
	// Wrong type
	if (typeof name !== "string") return false;
	
	// Spaces at the beginning or the end
	if (name !== name.trim()) return false;

	// Too short or too long
	if (name.length < 2 || name.length > 32) return false;
	
	// Invalid characters
	const validChars = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+)*$/;
	return validChars.test(name);
}