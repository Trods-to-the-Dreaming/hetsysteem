import GAME_ERRORS from "../constants/game.errors.js";
import GAME_RULES from "../constants/game.rules.js";
import { 
	convertHoursToYears,
	calculateLifeExpectancy	
} from "../utils/game.calculations.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";

//--- Show choose world page ---//
export const showChooseWorld = async (req, res) => {
	try {
		const [worlds] = await db.execute(
			`SELECT id, 
			        name 
			 FROM worlds 
			 ORDER BY id`
		);
		res.render("game/choose-world", {
			worlds
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Handle choose world request ---//
export const handleChooseWorld = async (req, res) => {
	const connection = await db.getConnection();
	try {
		await connection.beginTransaction();
		
		const { userId } = req.session;
		const { worldId } = req.body;

		// Fetch world
		const [worldsWithId] = await connection.execute(
			`SELECT * 
			 FROM worlds 
			 WHERE id = ?`,
			[worldId]
		);
		if (worldsWithId.length === 0) {
			const [worlds] = await connection.execute(
				`SELECT id, 
				        name 
				 FROM worlds 
				 ORDER BY id`
			);
			await connection.rollback();
			return res.render("game/choose-world", {
				worlds,
				error_chosen_world: GAME_ERRORS.INVALID_WORLD
			});
		}
		const world = worldsWithId[0];

		// Fetch user's character in this world
		const [myCharacters] = await connection.execute(
			`SELECT * 
			 FROM characters 
			 WHERE user_id = ? AND 
			       world_id = ?`,
			[userId, 
			 worldId]
		);
		if (myCharacters.length > 0) {
			const character = myCharacters[0];

			if (!character.is_customized) {
				await connection.commit();

				// Save session
				req.session.worldId = world.id;
				req.session.worldName = world.name;
				req.session.characterId = character.id;
				await saveSession(req);

				// Finish character customization before entering world
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
			return res.redirect("/game/menu");
		}
		
		// Fetch an AI-character to claim
		const [aiCharacter] = await connection.execute(
			`SELECT id 
			 FROM characters 
			 WHERE user_id IS NULL AND 
			       world_id = ? 
			 LIMIT 1`,
			[worldId]
		);
		if (aiCharacter.length === 0) {
			const [worlds] = await connection.execute(
				`SELECT id, 
				        name 
				 FROM worlds 
				 ORDER BY id`
			);
			await connection.rollback();
			return res.render("game/choose-world", {
				worlds,
				error_chosen_world: GAME_ERRORS.NO_NEW_CHARACTERS,
				selected_world_id: parseInt(worldId)
			});
		}

		// Claim the character
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
		console.error(err);
		return res.status(500).render("errors/500");
	} finally {
		if (connection) connection.release();
	}
};

//--- Show customize character page ---//
export const showCustomizeCharacter = async (req, res) => {
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
			 JOIN products ON recreations.product_id = products.id
			 ORDER BY recreations.id;`
		);
		res.render("game/customize-character", {
			jobs,
			recreations
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500"); 
	}
};

//--- Handle customize character request ---//
export const handleCustomizeCharacter = async (req, res) => {
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
			 JOIN products ON recreations.product_id = products.id
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
				error_job_preference: GAME_ERRORS.INVALID_JOB_PREFERENCE,
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
				error_job_preference: GAME_ERRORS.IDENTICAL_JOB_PREFERENCES,
				first_name: firstName,
				last_name: lastName
			});
		}
		
		// Validate recreation preference
		if (!validRecreationIds.includes(parseInt(recreationPreference))) {
			return res.render("game/customize-character", {
				jobs,
				recreations,
				error_recreation_preference: GAME_ERRORS.INVALID_RECREATION_PREFERENCE,
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
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show menu page ---//
export const showMenu = async (req, res) => {
	try {
		res.render("game/menu");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show character page ---//
export const showCharacter = async (req, res) => {
	try {
		const { userId, 
				worldId } = req.session;

		const [characters] = await db.execute(
			`SELECT c.*,
					j1.name AS job_preference_1,
					j2.name AS job_preference_2,
					j3.name AS job_preference_3,
					p.name AS recreation_preference
			 FROM characters c
			 JOIN jobs j1 ON c.job_preference_1_id = j1.id
			 JOIN jobs j2 ON c.job_preference_2_id = j2.id
			 JOIN jobs j3 ON c.job_preference_3_id = j3.id
			 JOIN recreations l ON c.recreation_preference_id = l.id
			 JOIN products p ON l.product_id = p.id
			 WHERE c.user_id = ? AND 
			       c.world_id = ?`,
			[userId, 
			 worldId]
		);

		if (characters.length === 0) {
			return res.status(404).render("errors/404");
		}
		const character = characters[0];
		
		// Life expectancy
		character.life_expectancy = calculateLifeExpectancy(
			character.age,
			character.cumulative_health_loss,
			character.cumulative_health_gain
		);
		
		// Education
		if (character.education > 0) {
			character.education_label = GAME_RULES.EDUCATION_LABELS[character.education];
		}
		
		// Job experience
		const [jobExperience] = await db.execute(
			`SELECT j.name AS job_name,
				    e.experience AS experience_hours
			 FROM character_job_experience e
			 JOIN jobs j ON e.job_id = j.id
			 WHERE e.character_id = ?`,
			[character.id]
		);
		character.job_experience = jobExperience.map((row) => ({
			job_name: row.job_name,
			experience_years: convertHoursToYears(row.experience_hours),
		}));

		res.render("game/character", { 
			character
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show statistics page ---//
export const showStatistics = async (req, res) => {
	try {
		res.render("game/statistics");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};