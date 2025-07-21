//=== Imports ===================================================================================//
import db from "../utils/db.js";
import saveSession from "../utils/session.js";
import { 
	getAllWorlds,
	getAllJobs,
	getAllRecreations,
	getWorld,
	getCharacter,
	findUserCharacter,
	claimAICharacter,
	customizeCharacter
} from "../helpers/game.helpers.js";

//=== Constants =================================================================================//
const MSG_NO_NEW_CHARACTERS = "Er is geen plaats meer voor nieuwe personages.";

//=== Main ======================================================================================//

//--- Choose world ------------------------------------------------------------------------------//
export const showChooseWorld = async (req, res, next) => {
	try {
		const worlds = await getAllWorlds();
		
		return res.render("game/choose-world", {
			worlds
		});
	} catch (err) {
		next(err);
	}
};

export const handleChooseWorld = async (req, res, next) => {
	const connection = await db.getConnection();
	try {
		const { userId } = req.session;
		const { worldId } = req.body;
		
		await connection.beginTransaction();

		const world = await getWorld(worldId, connection);

		// Find the user's character
		let character = await findUserCharacter(userId, worldId, connection);
		if (!character) {
			character = await claimAICharacter(userId, worldId, connection);
			
			if (!character) {
				const worlds = await getAllWorlds(connection);
				await connection.rollback();
				
				// All AI-characters have been claimed
				return res.render("game/choose-world", {
					worlds,
					selected_world_id: parseInt(worldId),
					world_error: MSG_NO_NEW_CHARACTERS
				});
			}
		}
		
		// Check if the user has already customized his character 
		if (!character.is_customized) {
			// Save session
			req.session.worldId = world.id;
			req.session.worldName = world.name;
			req.session.characterId = character.id;
			await saveSession(req);
			
			await connection.commit();
			
			// Customize character
			return res.redirect("/game/customize-character");
		}
		
		// Save session
		req.session.worldId = world.id;
		req.session.worldName = world.name;
		req.session.characterId = character.id;
		req.session.characterFirstName = character.first_name;
		req.session.characterLastName = character.last_name;
		await saveSession(req);
		
		await connection.commit();

		// Enter world
		return res.redirect("/game");
	} catch (err) {
		await connection.rollback();
		next(err);
	} finally {
		if (connection) connection.release();
	}
};

//--- Customize character -----------------------------------------------------------------------//
export const showCustomizeCharacter = async (req, res, next) => {
	try {
		const [
			jobs,
			recreations
		] = await Promise.all([
			getAllJobs(),
			getAllRecreations()
		]);
		
		return res.render("game/customize-character", {
			jobs,
			recreations
		});
	} catch (err) {
		next(err);
	}
};

export const handleCustomizeCharacter = async (req, res, next) => {
	try {
		const { userId,
				characterId } = req.session;
		const { characterFirstName, 
				characterLastName, 
				jobPreference1, 
				jobPreference2, 
				jobPreference3, 
				recreationPreference } = req.body;
				
		const character = await getCharacter(characterId);

		await validateJobPreferences(jobPreference1,
									 jobPreference2,
									 jobPreference3);
		await validateRecreationPreference(recreationPreference);
		
		// Check job preference uniqueness
		const jobPreferences = [jobPreference1, 
								jobPreference2, 
								jobPreference3].map(id => Number(id));
		const uniqueJobs = new Set(jobPreferences);
		if (uniqueJobs.size !== 3) {
			const [
				jobs,
				recreations
			] = await Promise.all([
				getAllJobs(),
				getAllRecreations()
			]);
			
			return res.render("game/customize-character", {
				jobs,
				recreations,
				job_preference_error: MSG_IDENTICAL_JOB_PREFERENCES,
				character_first_name: characterFirstName,
				character_last_name:  characterLastName
			});
		}
		
		// Customize character
		await customizeCharacter(characterId,
								 characterFirstName,
								 characterLastName,
								 jobPreference1,
								 jobPreference2,
								 jobPreference3,
								 recreationPreference);
		
		// Save session
		req.session.characterFirstName = characterFirstName;
		req.session.characterLastName = characterLastName;
		await saveSession(req);
		
		// Enter world
		return res.redirect("/game");
	} catch (err) {
		next(err);
	}
};


//--- Menu --------------------------------------------------------------------------------------//
export const showMenu = async (req, res, next) => {
	try {
		return res.render("game/menu");
	} catch (err) {
		next(err);
	}
};