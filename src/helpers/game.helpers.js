//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	BadRequestError, 
	ConflictError 
} from "../utils/errors.js";

import { getValidIds } from "./game-ids.helpers.js";

//=== Constants =================================================================================//
const MSG_INVALID_WORLD		   = "Onbestaande wereld.";
const MSG_INVALID_CHARACTER	   = "Onbestaand personage.";
const MSG_INVALID_JOB		   = "Ongeldige job.";
const MSG_INVALID_RECREATION   = "Ongeldige ontspanning.";
const MSG_NO_CHARACTER_CLAIMED = "Er kon geen personage worden aangemaakt. Probeer het opnieuw.";
const MSG_ALREADY_CUSTOMIZED   = "Je personage is al aangepast of bestaat niet meer.";

//=== Main ======================================================================================//

//--- Get all worlds ----------------------------------------------------------------------------//
export const getAllWorlds = async (connection = db) => {
	const [worlds] = await connection.execute(
		`SELECT id, 
		        name 
		 FROM worlds 
		 ORDER BY id`
	);
	return worlds;
};

//--- Get all jobs -----------------------------------------------------------------------------//
export const getAllJobs = async (connection = db) => {
	const [jobs] = await connection.execute(
		`SELECT id, 
		        name 
		 FROM jobs 
		 ORDER BY id`
	);
	return jobs;
};

//--- Get all recreations -----------------------------------------------------------------------//
export const getAllRecreations = async (connection = db) => {
	const [recreations] = await connection.execute(
		`SELECT recreations.id AS id, 
		        products.name AS name
		 FROM recreations
		 INNER JOIN products ON recreations.product_id = products.id
		 ORDER BY recreations.id`
	);
	return recreations;
};

//--- Get world ---------------------------------------------------------------------------------//
export const getWorld = async (id, 
							   connection = db) => {
	const [worlds] = await connection.execute(
		`SELECT id, 
		        name 
		 FROM worlds 
		 WHERE id = ?`,
		[id]
	);
	if (worlds.length === 0) {
		throw new BadRequestError(MSG_INVALID_WORLD);
	}
	return worlds[0];
};

//--- Get character -----------------------------------------------------------------------------//
export const getCharacter = async (id, 
								   connection = db) => {
	const [characters] = await connection.execute(
		`SELECT * 
		 FROM characters 
		 WHERE id = ?`,
		[id]
	);
	if (characters.length === 0) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	return characters[0];
};

//--- Find the user's character -----------------------------------------------------------------//
export const findUserCharacter = async (userId, 
										worldId, 
										connection = db) => {
	const [characters] = await connection.execute(
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
	return characters[0] || null;
};

//--- Claim an AI-character ---------------------------------------------------------------------//
export const claimAICharacter = async (userId, 
									   worldId, 
									   connection = db) => {
	// Find an AI-character
	const [freeCharacters] = await connection.execute(
		`SELECT id 
		 FROM characters 
		 WHERE user_id IS NULL AND
			   world_id = ? 
		 LIMIT 1
		 FOR UPDATE`,
		[worldId]
	);
	if (freeCharacters.length === 0) {
		return null;
	}
	const characterId = freeCharacters[0].id;

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

	const character = await getCharacter(characterId, connection);
	return character;
};

//--- Validate job preference -------------------------------------------------------------------//
export const validateJobPreferences = async (jobPreference1,
											 jobPreference2,
											 jobPreference3,
											 connection = db) => {
	const validJobIds = await getValidIds("jobs");
	
	const jobPreferences = [jobPreference1, jobPreference2, jobPreference3];
	for (const jobPreference of jobPreferences) {
		if (!validJobIds.has(Number(jobPreference))) {
			throw new BadRequestError(MSG_INVALID_JOB);
		}
	}
};

//--- Validate recreation preference ------------------------------------------------------------//
export const validateRecreationPreference = async (recreationPreference) => {
	const validRecreationIds = await getValidIds("recreations");
	
	if (!validRecreationIds.has(Number(recreationPreference))) {
		throw new BadRequestError(MSG_INVALID_RECREATION);
	}
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