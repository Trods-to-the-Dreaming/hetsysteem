//=== Imports ===================================================================================//
import saveSession from "../utils/session.js";
import { 
	convertHoursToYears,
	calculateLifeExpectancy	
} from "../utils/game.helpers.js";

import GAME_RULES from "../constants/game.rules.js";

//=== Constants =================================================================================//
const MSG_INVALID_WORLD					= "Ongeldige wereld geselecteerd.";
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

		// Find world
		const world = await findWorldById(worldId, connection);
		if (!world) {
			const worlds = await getAllWorlds(connection);
			await connection.rollback();
			
			return res.render("game/choose-world", {
				worlds,
				error_chosen_world: MSG_INVALID_WORLD
			});
		}

		// Find user's character in this world
		const myCharacter = await findUserCharacterInWorld(userId, worldId, connection);
		if (myCharacter) {
			if (!myCharacter.is_customized) {
				await connection.commit();

				// Save session
				req.session.worldId = world.id;
				req.session.worldName = world.name;
				req.session.characterId = myCharacter.id;
				await saveSession(req);

				// Finish character customization before entering world
				return res.redirect("/game/customize-character");
			}

			await connection.commit();

			// Save session
			req.session.worldId = world.id;
			req.session.worldName = world.name;
			req.session.characterId = myCharacter.id;
			req.session.characterFirstName = myCharacter.first_name;
			req.session.characterLastName = myCharacter.last_name;
			await saveSession(req);

			// Enter world
			return res.redirect("/game");
		}
		
		// Get an AI-character
		const aiCharacter = await getAICharacterInWorld(worldId, connection);
		if (!aiCharacter) {
			const worlds = await getAllWorlds(connection);
			await connection.rollback();
			
			return res.render("game/choose-world", {
				worlds,
				error_chosen_world: MSG_NO_NEW_CHARACTERS,
				selected_world_id: parseInt(worldId)
			});
		}

		// Claim the AI-character
		const characterId = aiCharacter[0].id;
		const [updateResult] = await connection.execute(
			`UPDATE characters
			 SET user_id = ?
			 WHERE id = ?`,
			[userId, 
			 characterId]
		);
		if (updateResult.affectedRows !== 1) {
			await connection.rollback();
			return res.status(403).render("errors/403");
		}

		// Search for the claimed character
		const [characters] = await connection.execute(
			`SELECT * 
			 FROM characters
			 WHERE user_id = ? AND 
			       world_id = ? AND 
				   is_customized = false`,
			[userId, 
			 worldId]
		);
		const character = characters[0];
		
		await connection.commit();

		// Save session
		req.session.worldId = world.id;
		req.session.worldName = world.name;
		req.session.characterId = character.id;
		await saveSession(req);

		// Customize the claimed character
		return res.redirect("/game/customize-character");
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
		const [jobs] = await db.execute(
			`SELECT id, 
			        name 
			 FROM jobs 
			 ORDER BY id`
		);
		const [recreations] = await db.execute(
			`SELECT recreations.id, 
			        products.name
			 FROM recreations
			 INNER JOIN products ON recreations.product_id = products.id
			 ORDER BY recreations.id;`
		);
		
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

		// Fetch jobs and recreations
		const [jobs] = await db.execute(
			`SELECT id, 
			        name 
			 FROM jobs 
			 ORDER BY id`
		);
		const [recreations] = await db.execute(
			`SELECT recreations.id, 
			        products.name
			 FROM recreations
			 INNER JOIN products ON recreations.product_id = products.id
			 ORDER BY recreations.id;`
		);
		
		// Fetch valid IDs
		const validJobIds = jobs.map(job => job.id);
		const validRecreationIds = recreations.map(recreation => recreation.id);

		// Validate job preferences
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
		
		// Validate job preference uniqueness
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
		
		// Validate recreation preference
		if (!validRecreationIds.includes(parseInt(recreationPreference))) {
			return res.render("game/customize-character", {
				jobs,
				recreations,
				error_recreation_preference: MSG_INVALID_RECREATION_PREFERENCE,
				first_name: firstName,
				last_name: lastName
			});
		}

		// Validate character
		const [characters] = await db.execute(
			`SELECT * 
			 FROM characters 
			 WHERE id = ? AND 
			       user_id = ? AND 
				   is_customized = false`,
			[characterId, 
			 userId]
		);
		if (characters.length === 0) {
			return res.status(403).render("errors/403");
		}

		// Update character
		await db.execute(
			`UPDATE characters
			 SET first_name = ?, 
			     last_name = ?, 
			     job_preference_1_id = ?, 
			     job_preference_2_id = ?, 
			     job_preference_3_id = ?, 
			     recreation_preference_id = ?, 
			     is_customized = true
			 WHERE id = ?`,
			[firstName,
			 lastName,
			 jobPreference1,
			 jobPreference2,
			 jobPreference3,
			 recreationPreference,
			 characterId]
		);

		// Save session
		req.session.characterFirstName = firstName;
		req.session.characterLastName = lastName;
		await saveSession(req);
		
		// Enter world
		return res.redirect("/game/menu");
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