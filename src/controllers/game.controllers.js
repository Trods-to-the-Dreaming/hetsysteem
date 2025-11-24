//=== Imports ===================================================================================//

import knex from '#utils/db.js';

import { 
	saveSession 
} from '#utils/session.js';

import { 
	ConflictError
} from '#utils/errors.js';

import { 
	MSG_NO_NEW_CHARACTERS,
	MSG_CHARACTER_NAME_TAKEN
} from '#constants/game.messages.js';

import { 
	BUILDING_SIZE_FACTORS
} from '#constants/game.rules.js';

import { 
	getWorlds,
	getProducts,
	getRecreations,
	getBuildings
} from '#helpers/game/static.helpers.js';

import { 
	getWorld,
	findUserCharacter,
	claimAICharacter
} from '#helpers/game/world.helpers.js';

import {
	buildCharacterView
} from '#helpers/game/character.helpers.js';

import {
	findCharacterName,
	findBuildingName,
	getTurnData,
	getOwnedResources,
	getOwnedProducts,
	getOwnedBuildings,
	getEmployeeContracts,
	getEmployerContracts,
	getTenantAgreements,
	getLandlordAgreements,
	markTurnFinished
} from '#helpers/game/state.helpers.js';

import {
	getCustomizeCharacter,
	setCustomizeCharacter
} from '#helpers/game/turn/customize-character.helpers.js';

import {
	getManageBuildings,
	setManageBuildings
} from '#helpers/game/turn/manage-buildings.helpers.js';

import {
	getManageEmploymentContracts,
	setManageEmploymentContracts
} from '#helpers/game/turn/manage-employment-contracts.helpers.js';

import {
	getManageRentalAgreements,
	setManageRentalAgreements
} from '#helpers/game/turn/manage-rental-agreements.helpers.js';

import {
	getProduce,
	setProduce
} from '#helpers/game/turn/produce.helpers.js';

import {
	getTrade,
	setTrade
} from '#helpers/game/turn/trade.helpers.js';

import {
	getShare,
	setShare
} from '#helpers/game/turn/share.helpers.js';

import {
	getConsume,
	setConsume
} from '#helpers/game/turn/consume.helpers.js';

import {
	getManageGroup,
	setManageGroup
} from '#helpers/game/turn/manage-group.helpers.js';

//=== Main ======================================================================================//

export const showEnterWorld = async (req, res, next) => {
	try {
		const worlds = await getWorlds();
		
		return res.render('game/enter-world', {
			worlds: worlds.all
		});
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const handleEnterWorld = async (req, res, next) => {
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
			const worlds = await getWorlds();

			return res.render('game/enter-world', {
				worlds: 	 	 worlds.all,
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
//-----------------------------------------------------------------------------------------------//
export const showMenu = async (req, res, next) => {
	try {
		return res.render('game/menu');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
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
//-----------------------------------------------------------------------------------------------//
export const startTurn = async (req, res, next) => {
	try {
		const { characterId } = req.session;

		const [
			products,
			recreations,
			buildings,
			turnData,
			ownedResources,
			ownedProducts,
			ownedBuildings,
			employeeContracts,
			employerContracts,
			tenantAgreements,
			landlordAgreements,
			customizeCharacter,
			manageBuildings,
			manageEmploymentContracts,
			manageRentalAgreements,
			produce,
			trade,
			share,
			consume,
			manageGroup
		] = await Promise.all([
			getProducts(),
			getRecreations(),
			getBuildings(),
			getTurnData(characterId),
			getOwnedResources(characterId),
			getOwnedProducts(characterId),
			getOwnedBuildings(characterId),
			getEmployeeContracts(characterId),
			getEmployerContracts(characterId),
			getTenantAgreements(characterId),
			getLandlordAgreements(characterId),
			getCustomizeCharacter(characterId),
			getManageBuildings(characterId),
			getManageEmploymentContracts(characterId),
			getManageRentalAgreements(characterId),
			getProduce(characterId),
			getTrade(characterId),
			getShare(characterId),
			getConsume(characterId),
			getManageGroup(characterId)
		]);
		
		const characterState = {
			...ownedResources,
			ownedProducts,
			ownedBuildings,
			employeeContracts,
			employerContracts,
			tenantAgreements,
			landlordAgreements
		};
		
		const characterActions = [
			customizeCharacter,
			manageBuildings,
			manageEmploymentContracts,
			manageRentalAgreements,
			produce,
			trade,
			share,
			consume,
			manageGroup
		];
		
		const urls = [
			'/game/turn/customize-character',
			'/game/turn/manage-buildings',
			'/game/turn/manage-employment-contracts',
			'/game/turn/manage-rental-agreements',
			'/game/turn/produce',
			'/game/turn/trade',
			'/game/turn/share',
			'/game/turn/consume',
			'/game/turn/manage-group'
		];

		const actionPages = urls.map((url, index) => ({
			url,
			isRelevant: index === 0 ? !turnData.isCharacterCustomized : true
		}));

		res.render('game/turn/start', {
			products: products.all,
			recreations: recreations.all,
			buildings: buildings.all,
			sizeFactors: BUILDING_SIZE_FACTORS,
			characterState,
			characterActions,
			actionPages,
			finished: turnData.finished
		});
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showCustomizeCharacter = async (req, res, next) => {
	try {
		return res.render('game/turn/customize-character');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showManageBuildings = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-buildings');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showManageEmploymentContracts = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-employment-contracts');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showManageRentalAgreements = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-rental-agreements');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showProduce = async (req, res, next) => {
	try {
		return res.render('game/turn/produce');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showTrade = async (req, res, next) => {
	try {
		return res.render('game/turn/trade');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showShare = async (req, res, next) => {
	try {
		return res.render('game/turn/share');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showConsume = async (req, res, next) => {
	try {
		return res.render('game/turn/consume');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showManageGroup = async (req, res, next) => {
	try {
		return res.render('game/turn/manage-group');
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const finishTurn = async (req, res, next) => {
	try {
		const { characterActions } = req.body;
		const { characterId,
				worldId } = req.session;
		
		await knex.transaction(async (trx) => {
			await setCustomizeCharacter(
				characterActions[0], 
				characterId, 
				worldId,
				trx
			);
			await setManageBuildings(
				characterActions[1], 
				characterId, 
				worldId,
				trx
			);
			/*await setManageEmploymentContracts(
				characterActions[2], 
				characterId,
				trx
			);
			await setManageRentalAgreements(
				characterActions[3], 
				characterId,
				trx
			);
			await setProduce(
				characterActions[4], 
				characterId,
				trx
			);
			await setTrade(
				characterActions[5], 
				characterId,
				trx
			);
			await setShare(
				characterActions[6], 
				characterId,
				trx
			);
			await setConsume(
				characterActions[7], 
				characterId,
				trx
			);
			await setManageGroup(
				characterActions[8], 
				characterId,
				trx
			);*/
			await markTurnFinished( 
				characterId,
				trx
			);
		});

		res.status(200).json({ success: true });
	} catch (err) {
		if (err instanceof ConflictError) {			
			return res.status(err.status).json({ 
				success: false,
				error: err.message,
				redirect: err.info?.type === 'character' 
						  ? '/game/turn/character-name-conflict'
						  : '/game/turn/building-name-conflict',
				info: err.info
			});
		}
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const isCharacterNameAvailable = async (req, res, next) => {
	try {
		const { firstName, 
				lastName } = req.query;
		const { characterId,
				worldId } = req.session;
		
		const duplicate = await findCharacterName(
			firstName,
			lastName,
			characterId,
			worldId
		);
		
		res.json({ available: !duplicate });
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const isBuildingNameAvailable = async (req, res, next) => {
	try {
		const { buildingName } = req.query;
		const { worldId } = req.session;
		
		const duplicate = await findBuildingName(
			buildingName,
			worldId
		);
		
		res.json({ available: !duplicate });
	} catch (err) {
		next(err);
	}
};
//-----------------------------------------------------------------------------------------------//
export const showCharacterNameConflict = async (req, res, next) => {
	
};
//-----------------------------------------------------------------------------------------------//
export const showBuildingNamesConflict = async (req, res, next) => {
	
};
//-----------------------------------------------------------------------------------------------//
export const showStatistics = async (req, res, next) => {
	try {
		return res.render('game/statistics');
	} catch (err) {
		next(err);
	}
};