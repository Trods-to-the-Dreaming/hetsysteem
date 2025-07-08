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
const MSG_NO_NEW_CHARACTERS				= "Er is geen plaats meer voor nieuwe personages.";
const MSG_INVALID_JOB_PREFERENCE		= "Ongeldige job geselecteerd.";
const MSG_INVALID_RECREATION_PREFERENCE	= "Ongeldige ontspanning geselecteerd.";
const MSG_IDENTICAL_JOB_PREFERENCES		= "Kies drie verschillende jobs.";

//=== Main ======================================================================================//

//--- Show choose world page --------------------------------------------------------------------//
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

//--- Handle choose world request ---------------------------------------------------------------//
export const handleChooseWorld = async (req, res, next) => {
	const connection = await db.getConnection();
	try {
		await connection.beginTransaction();
		
		const { userId } = req.session;
		const { worldId } = req.body;

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
					error_chosen_world: MSG_NO_NEW_CHARACTERS,
					selected_world_id: parseInt(worldId)
				});
			}
		}
		
		// Check if the user has already customized his character 
		if (!character.is_customized) {
			await connection.commit();

			// Save session
			req.session.worldId = world.id;
			req.session.worldName = world.name;
			req.session.characterId = character.id;
			await saveSession(req);
			
			// Customize character
			return res.redirect("/game/customize-character");
		}
		
		await connection.commit();

		// Save session
		req.session.worldId = world.id;
		req.session.worldName = world.name;
		req.session.characterId = character.id;
		req.session.characterFirstName = character.first_name;
		req.session.characterLastName = character.last_name;
		await saveSession(req);

		// Enter world
		return res.redirect("/game");
	} catch (err) {
		await connection.rollback();
		next(err);
	} finally {
		if (connection) connection.release();
	}
};

//--- Show customize character page -------------------------------------------------------------//
export const showCustomizeCharacter = async (req, res, next) => {
	try {
		const jobs = await getAllJobs();
		const recreations = await getAllRecreations();
		
		return res.render("game/customize-character", {
			jobs,
			recreations
		});
	} catch (err) {
		next(err);
	}
};

//--- Handle customize character request --------------------------------------------------------//
export const handleCustomizeCharacter = async (req, res, next) => {
	try {
		const { userId,
				characterId } = req.session;
		const { firstName, 
				lastName, 
				jobPreference1, 
				jobPreference2, 
				jobPreference3, 
				recreationPreference } = req.body;
				
		const character = await getCharacter(characterId);

		const jobs = await getAllJobs();
		const recreations = await getAllRecreations();
		
		const validJobIds = jobs.map(job => job.id);
		const validRecreationIds = recreations.map(recreation => recreation.id);

		// Check job preference existence
		const jobIds = [jobPreference1, jobPreference2, jobPreference3].map(id => parseInt(id));
		if (!jobIds.every(id => validJobIds.includes(id))) {
			return res.render("game/customize-character", {
				jobs,
				recreations,
				error_job_preference: MSG_INVALID_JOB_PREFERENCE,
				first_name: firstName,
				last_name: lastName
			});
		}
		
		// Check job preference uniqueness
		const uniqueJobs = new Set(jobIds);
		if (uniqueJobs.size !== 3) {
			return res.render("game/customize-character", {
				jobs,
				recreations,
				error_job_preference: MSG_IDENTICAL_JOB_PREFERENCES,
				first_name: firstName,
				last_name: lastName
			});
		}
		
		// Check recreation preference existence
		if (!validRecreationIds.includes(parseInt(recreationPreference))) {
			return res.render("game/customize-character", {
				jobs,
				recreations,
				error_recreation_preference: MSG_INVALID_RECREATION_PREFERENCE,
				first_name: firstName,
				last_name: lastName
			});
		}
		
		// Customize character
		await customizeCharacter(characterId,
								 firstName,
								 lastName,
								 jobPreference1,
								 jobPreference2,
								 jobPreference3,
								 recreationPreference);
		
		// Save session
		req.session.characterFirstName = firstName;
		req.session.characterLastName = lastName;
		await saveSession(req);
		
		// Enter world
		return res.redirect("/game");
	} catch (err) {
		next(err);
	}
};

//--- Show menu page ----------------------------------------------------------------------------//
export const showMenu = async (req, res, next) => {
	try {
		return res.render("game/menu");
	} catch (err) {
		next(err);
	}
};