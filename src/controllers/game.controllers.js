import GAME from "../constants/game.js";
import db from "../utils/db.js";
import saveSession from "../utils/session.js";

//--- Show choose world page ---//
export const showChooseWorld = async (req, res) => {
	try {
		const [worlds] = await db.execute(
			`SELECT id, name FROM worlds ORDER BY id`
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
			`SELECT * FROM worlds WHERE id = ?`,
			[worldId]
		);
		if (worldsWithId.length === 0) {
			const [worlds] = await connection.execute(
				`SELECT id, name FROM worlds ORDER BY id`
			);
			await connection.rollback();
			return res.render("game/choose-world", {
				worlds,
				errorChosenWorld: GAME.INVALID_WORLD,
				selectedWorldId: parseInt(worldId)
			});
		}
		const world = worldsWithId[0];

		// Fetch user's character in this world
		const [myCharacters] = await connection.execute(
			`SELECT * FROM characters WHERE user_id = ? AND world_id = ?`,
			[userId, worldId]
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
			return res.redirect("/game/world");
		}
		
		// Fetch an AI-character to claim
		const [aiCharacter] = await connection.execute(
			`SELECT id FROM characters WHERE user_id IS NULL AND world_id = ? LIMIT 1`,
			[worldId]
		);
		if (aiCharacter.length === 0) {
			const [worlds] = await connection.execute(
				`SELECT id, name FROM worlds ORDER BY id`
			);
			await connection.rollback();
			return res.render("game/choose-world", {
				worlds,
				errorChosenWorld: GAME.NO_NEW_CHARACTERS,
				selectedWorldId: parseInt(worldId)
			});
		}

		// Claim the character
		const characterId = aiCharacter[0].id;
		const [updateResult] = await connection.execute(
			`UPDATE characters
			 SET user_id = ?
			 WHERE id = ?`,
			[userId, characterId]
		);
		if (updateResult.affectedRows !== 1) {
			await connection.rollback();
			return res.status(403).render("errors/403");
		}

		// Search for the claimed character
		const [characters] = await connection.execute(
			`SELECT * FROM characters WHERE user_id = ? AND world_id = ? AND is_customized = false`,
			[userId, worldId]
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
			`SELECT id, name FROM jobs ORDER BY id`
		);
		const [luxury_preferences] = await db.execute(
			`SELECT id, name FROM luxury_preferences ORDER BY id`
		);
		res.render("game/customize-character", {
			jobs,
			luxury_preferences
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
				luxuryPreference } = req.body;

		// Check if job preferences are different
		if (
			jobPreference1 === jobPreference2 ||
			jobPreference1 === jobPreference3 ||
			jobPreference2 === jobPreference3
		) {
			const [jobs] = await db.execute(
				`SELECT id, name FROM jobs ORDER BY id`
			);
			const [luxury_preferences] = await db.execute(
				`SELECT id, name FROM luxury_preferences ORDER BY id`
			);
			return res.render("game/customize-character", {
				jobs,
				luxury_preferences,
				errorJobPreference: GAME.INVALID_JOB_PREFERENCES,
				firstName,
				lastName
			});
		}
		
		// Check character
		const [characters] = await db.execute(
			`SELECT * FROM characters WHERE id = ? AND user_id = ? AND is_customized = false`,
			[characterId, userId]
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
			     luxury_preference_id = ?, 
			     is_customized = true
			 WHERE id = ?`,
			[
				firstName,
				lastName,
				jobPreference1,
				jobPreference2,
				jobPreference3,
				luxuryPreference,
				characterId
			]
		);

		// Save session
		req.session.characterFirstName = firstName;
		req.session.characterLastName = lastName;
		await saveSession(req);
		
		// Enter world
		return res.redirect("/game/world");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show play page ---//
export const showPlay = async (req, res) => {
	try {
		res.render("game/world");
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
				  l.name AS luxury_preference
		   FROM characters c
		   JOIN jobs j1 ON c.job_preference_1_id = j1.id
		   JOIN jobs j2 ON c.job_preference_2_id = j2.id
		   JOIN jobs j3 ON c.job_preference_3_id = j3.id
		   JOIN luxury_preferences l ON c.luxury_preference_id = l.id
		   WHERE c.user_id = ? AND c.world_id = ?`,
		  [userId, worldId]
		);

		if (characters.length === 0) {
			return res.status(404).render("errors/404");
		}
		const character = characters[0];

		res.render("game/world/character", { 
			character
		});
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show actions page ---//
export const showActions = async (req, res) => {
	try {
		res.render("game/world/actions");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};

//--- Show statistics page ---//
export const showStatistics = async (req, res) => {
	try {
		res.render("game/world/statistics");
	} catch (err) {
		console.error(err);
		return res.status(500).render("errors/500");
	}
};