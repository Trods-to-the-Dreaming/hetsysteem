//=== Imports ===================================================================================//
import knex from '../utils/db.js';
import saveSession from '../utils/session.js';

import { 
	MSG_NO_NEW_CHARACTERS,
	MSG_CHARACTER_NAME_TAKEN
} from '../constants/game.messages.js';

import { 
	getAllWorlds,
	getAllProducts,
	getAllRecreations,
	getAllBuildings
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
	isCharacterNameAvailable,
	isBuildingNameAvailable,
	getCharacterState, 
	getCharacterProducts,
	getCharacterBuildings,
	getEmployeeContracts,
	getEmployerContracts,
	getTenantAgreements,
	getLandlordAgreements,	
	getCharacterCustomization,
	getBuildingsManagement,
	getEmploymentContractsManagement,
	getRentalAgreementsManagement,
	getProduction,
	getTrading,
	getSharing,
	getConsumption,
	getGroupManagement,
	buildCharacterView
} from '../helpers/game-character.helpers.js';


	getCharacterCustomization,
	getBuildingsManagement,
	getEmploymentContractsManagement,
	getRentalAgreementsManagement,
	getProduction,
	getTrading,
	getSharing,
	getConsumption,
	getGroupManagement

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
		/*const { characterId,
				worldId } = req.session;
		
		const character = await buildCharacterView(characterId, worldId);*/
		
		return res.render('game/character'/*, { 
			...character
		}*/);
	} catch (err) {
		next(err);
	}
};

//--- Turn --------------------------------------------------------------------------------------//
export const showTurn = async (req, res, next) => {
	try {
		const { characterId } = req.session;

		const [
			allProducts,
			allRecreations,
			allBuildings
		] = await Promise.all([
			getAllProducts(),
			getAllRecreations(),
			getAllBuildings()
		]);
		
		const characterData = {
			state: await getCharacterState(characterId),
			products: await getCharacterProducts(characterId),
			buildings: await getCharacterBuildings(characterId),
			employeeContracts: await getEmployeeContracts(characterId),
			employerContracts: await getEmployerContracts(characterId),
			tenantAgreements: await getTenantAgreements(characterId),
			landlordAgreements: await getLandlordAgreements(characterId),
		};
		

		//const turnNumber = 0;
		
		const characterActions = await Promise.all([
			getCharacterCustomization(characterId),
			getBuildingsManagement(characterId),
			getEmploymentContractsManagement(characterId),
			getRentalAgreementsManagement(characterId),
			getProduction(characterId),
			getTrading(characterId),
			getSharing(characterId),
			getConsumption(characterId),
			getGroupManagement(characterId)
		]);
		
		console.dir(characterActions, { depth: null });
		
		const steps = [
			{ url: '/game/turn/customize-character', isRelevant: !characterData.state.isCustomized },
			{ url: '/game/turn/manage-buildings', isRelevant: true },
			{ url: '/game/turn/manage-employment-contracts', isRelevant: false },
			{ url: '/game/turn/manage-rental-agreements', isRelevant: true },
			{ url: '/game/turn/produce', isRelevant: true },
			{ url: '/game/turn/trade', isRelevant: true },
			{ url: '/game/turn/share', isRelevant: true },
			{ url: '/game/turn/consume', isRelevant: true },
			{ url: '/game/turn/manage-group', isRelevant: true }
		];
		
		const firstStepIndex = steps.findIndex(step => step.isRelevant === true);
		const lastStepIndex = steps.findLastIndex(step => step.isRelevant === true);
		const activeStepIndex = firstStepIndex;

		res.render('game/turn/begin', {
			allProducts,
			allRecreations,
			allBuildings,
			characterData,
			characterActions,
			steps,
			firstStepIndex,
			lastStepIndex,
			activeStepIndex
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

//--- Check character name -------------------------------------------------------------------//
export const checkCharacterName = async (req, res, next) => {
	try {
		const { firstName, 
				lastName } = req.query;
		const { characterId,
				worldId } = req.session;

		const available = await isCharacterNameAvailable(
			characterId,
			worldId, 
			firstName, 
			lastName
		);
		
		res.json({ available });
	} catch (err) {
		next(err);
	}
};

//--- Check building name -----------------------------------------------------------------------//
export const checkBuildingName = async (req, res, next) => {
	try {
		const { name } = req.query;
		const { worldId } = req.session;

		const available = await isBuildingNameAvailable(
			worldId, 
			name
		);
		
		res.json({ available });
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