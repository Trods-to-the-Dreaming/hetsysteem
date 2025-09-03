//=== Imports ===================================================================================//
import knex from '../utils/db.js';
import saveSession from '../utils/session.js';

import { 
	MSG_NO_NEW_CHARACTERS,
	MSG_CHARACTER_NAME_TAKEN
} from '../constants/game.messages.js';

import { 
	getAllWorlds/*,
	getAllJobs,
	getAllRecreations*/
} from '../helpers/game-static.helpers.js';

import { 
	getWorld,
	findUserCharacter,
	claimAICharacter/*,
	validateCharacterId,
	validateName,
	validateJobPreferences,
	validateRecreationPreference,
	isCharacterNameTaken,
	customizeCharacter*/
} from '../helpers/game-world.helpers.js';

import { 
	buildCharacterView
} from '../helpers/game-character.helpers.js';

//=== Main ======================================================================================//

//--- Choose world ------------------------------------------------------------------------------//
export const showChooseWorld = async (req, res, next) => {
	try {
		const worlds = await getAllWorlds();
		
		return res.render('game/choose-world', {
			worlds: worlds.options
		});
	} catch (err) {
		next(err);
	}
};

export const handleChooseWorld = async (req, res, next) => {
	try {
		const { userId } = req.session;
		const { worldId } = req.body;
		
		let character;
		
		await knex.transaction(async (trx) => {
			// Get the selected world
			const world = await getWorld(worldId, trx);

			// Find the user's character
			character = await findUserCharacter(userId, worldId, trx);
			
			if (!character) {
				// Claim an AI-character
				character = await claimAICharacter(userId, worldId, trx);
			}
			
			if (character) {
				// Save session
				req.session.worldId = world.id;
				req.session.worldType = world.type;
				req.session.characterId = character.id;
				req.session.characterFirstName = character.firstName;
				req.session.characterLastName = character.lastName;
				await saveSession(req);
			}
		});
		
		if (!character) {
			// All AI-characters have been claimed
			const worlds = await getAllWorlds();

			return res.render('game/choose-world', {
				worlds: 		 worlds.options,
				selectedWorldId: parseInt(worldId),
				worldError:	     MSG_NO_NEW_CHARACTERS
			});
		}
				
		// Enter world
		return res.redirect('/game');
	} catch (err) {
		next(err);
	}
};

//--- Menu --------------------------------------------------------------------------------------//
export const showMenu = async (req, res, next) => {
	try {
		return res.render('game/menu');
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
		
		return res.render('game/character', { 
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
		
		/*const [
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
		
		return res.render('game/turn/manage-buildings', { 
			...characterContext,
			buildings: buildings.options,
			products:  products.options,
			jobs: 	   jobs.options
		});
		
		
					// Check if the user has already customized his character 
			if (!character.is_customized) {
				// Save session
				req.session.worldId = world.id;
				req.session.worldType = world.type;
				req.session.characterId = character.id;
				await saveSession(req);
				
				// Customize character
				return res.redirect('/game/setup/customize-character');
			}
		*/
		
		const character = {
			isCustomized: true
		};
		
		const steps = [
			{ url: '/game/turn/customize-character', show: !character.isCustomized },
			{ url: '/game/turn/manage-buildings', show: true },
			{ url: '/game/turn/manage-employment-contracts', show: false },
			{ url: '/game/turn/manage-rental-agreements', show: true },
			{ url: '/game/turn/produce', show: true },
			{ url: '/game/turn/trade', show: true },
			{ url: '/game/turn/share', show: true },
			{ url: '/game/turn/consume', show: true },
			{ url: '/game/turn/manage-group', show: true }
		];
		
		const firstStep = steps.findIndex(step => step.show === true);
		const lastStep = steps.findLastIndex(step => step.show === true);
		
		const currentStep = firstStep;

		res.render('game/turn/begin', {
			character,
			steps,
			firstStep,
			lastStep,
			currentStep
		});
	} catch (err) {
		next(err);
	}
};

//--- Customize character -----------------------------------------------------------------------//
export const showCustomizeCharacter = async (req, res, next) => {
	try {
		return res.render('game/turn/customize-character');
	} catch (err) {
		next(err);
	}
};

//--- Manage buildings --------------------------------------------------------------------------//
export const showManageBuildings = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-buildings');
	} catch (err) {
		next(err);
	}
};

//--- Manage employment contracts ---------------------------------------------------------------//
export const showManageEmploymentContracts = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-employment-contracts');
	} catch (err) {
		next(err);
	}
};

//--- Manage rental agreements ------------------------------------------------------------------//
export const showManageRentalAgreements = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-rental-agreements');
	} catch (err) {
		next(err);
	}
};

//--- Produce -----------------------------------------------------------------------------------//
export const showProduce = async (req, res, next) => {
	try {
		return res.render('game/turn/produce');
	} catch (err) {
		next(err);
	}
};

//--- Trade -------------------------------------------------------------------------------------//
export const showTrade = async (req, res, next) => {
	try {
		return res.render('game/turn/trade');
	} catch (err) {
		next(err);
	}
};

//--- Share -------------------------------------------------------------------------------------//
export const showShare = async (req, res, next) => {
	try {
		return res.render('game/turn/share');
	} catch (err) {
		next(err);
	}
};

//--- Consume -----------------------------------------------------------------------------------//
export const showConsume = async (req, res, next) => {
	try {
		return res.render('game/turn/consume');
	} catch (err) {
		next(err);
	}
};

//--- Manage group ------------------------------------------------------------------------------//
export const showManageGroup = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-group');
	} catch (err) {
		next(err);
	}
};
/*
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
		
		return res.render('game/setup/customize-character', {
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

			return res.render('game/setup/customize-character', {
				firstName,
				lastName,
				jobPreference1,
				jobPreference2,
				jobPreference3,
				recreationPreference,
				jobs: 		 jobs.options,
				recreations: recreations.options,
				nameError:   MSG_CHARACTER_NAME_TAKEN,
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
		return res.redirect('/game');
	} catch (err) {
		await connection.rollback();
		next(err);
	} finally {
		if (connection) connection.release();
	}
};





export const handleTurn = async (req, res, next) => {
	try {
		const { characterId } = req.session;
		
		const currentActionIndex = await getCurrentActionIndex(characterId);
		const currentAction = ACTIONS[currentActionIndex];
		return res.redirect(`/game/actions/${currentAction}`);
	} catch (err) {
		next(err);
	}
};

//--- Show statistics page ----------------------------------------------------------------------//
export const showStatistics = async (req, res, next) => {
	try {
		return res.render('game/statistics');
	} catch (err) {
		next(err);
	}
};
*/