//=== Imports ===================================================================================//
import db from "../utils/db.js";
import saveSession from "../utils/session.js";

import { 
	MSG_NO_NEW_CHARACTERS,
	MSG_CHARACTER_NAME_TAKEN
} from "../constants/game.messages.js";

import { 
	getAllWorlds,
	getAllJobs,
	getAllRecreations
} from "../helpers/game-static.helpers.js";

import { 
	getWorld,
	findUserCharacter,
	claimAICharacter,
	validateCharacterId,
	validateName,
	validateJobPreferences,
	validateRecreationPreference,
	isCharacterNameTaken,
	customizeCharacter
} from "../helpers/game-setup.helpers.js";

import { 
	buildCharacterView
} from "../helpers/game-character.helpers.js";

//=== Main ======================================================================================//

//--- Choose world ------------------------------------------------------------------------------//
export const showChooseWorld = async (req, res, next) => {
	try {
		const worlds = await getAllWorlds();
		
		return res.render("game/setup/choose-world", {
			worlds: worlds.options
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
		
		// Get the selected world
		const world = await getWorld(worldId, connection);

		// Find the user's character
		let character = await findUserCharacter(userId, worldId, connection);
		if (!character) {
			character = await claimAICharacter(userId, worldId, connection);
			
			if (!character) {
				const worlds = await getAllWorlds(connection);
				await connection.rollback();
				
				// All AI-characters have been claimed
				return res.render("game/setup/choose-world", {
					worlds: 		   worlds.options,
					selected_world_id: parseInt(worldId),
					world_error:	   MSG_NO_NEW_CHARACTERS
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
			return res.redirect("/game/setup/customize-character");
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
		
		return res.render("game/setup/customize-character", {
			jobs: 		 jobs.options,
			recreations: recreations.options
		});
	} catch (err) {
		next(err);
	}
};

export const handleCustomizeCharacter = async (req, res, next) => {
	const connection = await db.getConnection();
	try {
		const { userId,
				worldId,
				characterId } = req.session;
		const { firstName, 
				lastName, 
				jobPreference1, 
				jobPreference2, 
				jobPreference3, 
				recreationPreference } = req.body;
		
		// Validate user input
		await validateCharacterId(characterId);
		await validateName(firstName,
						   lastName);
		await validateJobPreferences(jobPreference1,
									 jobPreference2,
									 jobPreference3);
		await validateRecreationPreference(recreationPreference);
		
		await connection.beginTransaction();
		
		// Check if name is already taken
		const isNameTaken = await isCharacterNameTaken(characterId,
													   worldId,
													   firstName, 
													   lastName, 
													   connection);
		if (isNameTaken) {
			const [
				jobs,
				recreations
			] = await Promise.all([
				getAllJobs(connection),
				getAllRecreations(connection)
			]);
			await connection.rollback();

			return res.render("game/setup/customize-character", {
				first_name: firstName,
				last_name:  lastName,
				jobPreference1,
				jobPreference2,
				jobPreference3,
				recreationPreference,
				jobs: 		 jobs.options,
				recreations: recreations.options,
				name_error:  MSG_CHARACTER_NAME_TAKEN,
			});
		}
		
		// Customize character
		await customizeCharacter(characterId,
								 firstName,
								 lastName,
								 jobPreference1,
								 jobPreference2,
								 jobPreference3,
								 recreationPreference,
								 connection);
		
		// Save session
		req.session.characterFirstName = firstName;
		req.session.characterLastName = lastName;
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

//--- Menu --------------------------------------------------------------------------------------//
export const showMenu = async (req, res, next) => {
	try {
		return res.render("game/menu");
	} catch (err) {
		next(err);
	}
};

//--- Character ---------------------------------------------------------------------------------//
export const showCharacter = async (req, res, next) => {
	try {
		const { characterId,
				worldId } = req.session;
		
		const character = await buildCharacterView(characterId, worldId);
		
		return res.render("game/character", { 
			...character
		});
	} catch (err) {
		next(err);
	}
};

//--- Turn --------------------------------------------------------------------------------------//
export const showTurn = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const [
			characterContext,
			buildings,
			products,
			jobs
		] = await Promise.all([
			getCharacterContext(characterId),
			getAllBuildings(),
			getAllProducts(),
			getAllJobs(),
		]);
		
		return res.render("game/turn/manage-buildings", { 
			...characterContext,
			buildings: buildings.options,
			products:  products.options,
			jobs: 	   jobs.options
		});
	} catch (err) {
		next(err);
	}
};

export const handleTurn = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		/*const currentActionIndex = await getCurrentActionIndex(characterId);
		const currentAction = ACTIONS[currentActionIndex];
		return res.redirect(`/game/actions/${currentAction}`);*/
	} catch (err) {
		next(err);
	}
};

//--- Show statistics page ----------------------------------------------------------------------//
export const showStatistics = async (req, res, next) => {
	try {
		return res.render("game/statistics");
	} catch (err) {
		next(err);
	}
};