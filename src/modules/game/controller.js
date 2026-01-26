import { 
	saveSession
} from '#utils/session.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GAME
} from './reasons.js';
import { 
	getEnterWorldOptions,
	enterWorld
} from './enter-world/service.js';
import { 
	listJobs,
	listRecreations
} from './turn/create-character/repository.js';
import { 
	getCreateCharacterOptions,
	getCreateCharacterFormState,
	createCharacter
} from './turn/create-character/service.js';
/*import { 
	buildCharacterView 
} from './character/service.js';*/
import { 
	/*buildTurnView,
	finishTurn,
	checkCharacterName,
	checkBuildingName,*/
	processActions 
} from './turn/service.js';

//===============================================================================================//

export async function showEnterWorld(req, res) {
	delete req.session.character;
	delete req.session.world;
	
	const options = await getEnterWorldOptions();
	
	return res.render('game/enter-world', options);
}
//-----------------------------------------------------------------------------------------------//
export async function handleEnterWorld(req, res) {
	const { user } = req.session;
	const formState = req.validatedData;
	
	const {
		world,
		character
	} = await enterWorld({ 
		userId: user.id,
		formState
	});
	
	req.session.world = { 
		id: world.id,
		name: world.name,
		class: world.class
	};
	
	if (character) {
		req.session.character = {
			id: character.id,
			firstName: character.firstName,
			lastName: character.lastName
		};
	} else {
		delete req.session.character;
	}
	
	await saveSession(req);
	
	return res.redirect('/game');
}
//-----------------------------------------------------------------------------------------------//
export function showMenu(req, res) {
	const hasCharacter = Boolean(req.session.character);
	
	return res.render('game/menu', {
		hasCharacter
	});
}
//-----------------------------------------------------------------------------------------------//
export async function showCreateCharacter(req, res) {
	const { 
		user,
		world 
	} = req.session;

	const options = await getCreateCharacterOptions();
	const formState = await getCreateCharacterFormState({ 
		userId: user.id, 
		worldId: world.id
	});
	
	return res.render('game/turn/create-character', {
		...options,
		...formState
	});
}
//-----------------------------------------------------------------------------------------------//
export async function handleCreateCharacter(req, res) {
	const { 
		user,
		world 
	} = req.session;
	const formState = req.validatedData;
	
	const result = await createCharacter({
		userId: user.id, 
		worldId: world.id, 
		formState
	});
	if (!result.ok) {
		const options = await getCreateCharacterOptions();
		
		return res.status(result.status).render('game/turn/create-character', {
			...options,
			...formState,
			createCharacterError: GAME.MESSAGE[result.reason]
		});
	}
	
	return res.redirect('/game');
}
//-----------------------------------------------------------------------------------------------//
export async function showCharacter(req, res) {
	const { 
		character,
		world 
	} = req.session;
			
	const characterView = await buildCharacterView({ 
		characterId: character.id,
		worldId: world.id
	});
	
	return res.render('game/character', characterView);
}
//-----------------------------------------------------------------------------------------------//
/*export async function showStartTurn(req, res) {
	const { character } = req.session;

	const turnView = await buildTurnView(character.id);
	
	return res.render('game/turn/start', turnView);
};
//-----------------------------------------------------------------------------------------------//
export function showCustomizeCharacter(req, res) {
	return res.render('game/turn/customize-character');
};
//-----------------------------------------------------------------------------------------------//
export function showManageBuildings(req, res) {
	return res.render('game/turn/manage-buildings');
};
//-----------------------------------------------------------------------------------------------//
export function showManageEmploymentContracts(req, res) {
	return res.render('game/turn/manage-employment-contracts');
};
//-----------------------------------------------------------------------------------------------//
export function showManageRentalAgreements(req, res) {
	return res.render('game/turn/manage-rental-agreements');
};
//-----------------------------------------------------------------------------------------------//
export function showProduce(req, res) {
	return res.render('game/turn/produce');
};
//-----------------------------------------------------------------------------------------------//
export function showTrade(req, res) {
	return res.render('game/turn/trade');
};
//-----------------------------------------------------------------------------------------------//
export function showShare(req, res) {
	return res.render('game/turn/share');
};
//-----------------------------------------------------------------------------------------------//
export function showConsume(req, res) {
	return res.render('game/turn/consume');
};
//-----------------------------------------------------------------------------------------------//
export function showManageGroup(req, res) {
	return res.render('game/turn/manage-group');
};
//-----------------------------------------------------------------------------------------------//
export async function handleReserveBuildingName(req, res) {
	const { 
		user,
		world 
	} = req.session;
	const { buildingName } = req.validatedData;

	const result = await reserveBuildingName({ 
		userId: user.id, 
		worldId: world.id, 
		buildingName 
	});
	if (!result.ok) {
		return res.status(409).json({
			success: false,
			error: {
				code: result.reason,
				message: GAME.MESSAGE[result.reason]
			}
		});
	}
	
	return res.status(200).json({ success: true });
}
//-----------------------------------------------------------------------------------------------//
export async function handleFinishTurn(req, res) {
	const { 
		character,
		world 
	} = req.session;
	const { phases } = req.validatedData;
	
	const result = await finishTurn({ 
		characterId: character.id, 
		worldId: world.id, 
		phases 
	});
	if (!result.ok) {
		return res.status(409).json({
			errorMessage: GAME.MESSAGE[result.reason],
			nameConflicts: result.meta
		});
	}
	
	return res.status(200).json({ success: true });
};
//-----------------------------------------------------------------------------------------------//
export async function handleCheckCharacterName(req, res) {
	const { 
		character,
		world 
	} = req.session;
	const { 
		firstName, 
		lastName 
	} = req.validatedData;

	const result = await checkCharacterName({ 
		characterId: character.id, 
		worldId: world.id, 
		firstName, 
		lastName 
	});
	if (!result.ok) {
		return res.status(409).json({
			errorMessage: GAME.MESSAGE[result.reason]
		});
	}
	
	return res.status(200).json({ success: true });
};
//-----------------------------------------------------------------------------------------------//
export async function handleCheckBuildingName(req, res) {
	const { world } = req.session;
	const { buildingName } = req.validatedData;
	
	const result = await checkBuildingName({ 
		worldId: world.id, 
		buildingName
	});
	if (!result.ok) {
		return res.status(409).json({
			errorMessage: GAME.MESSAGE[result.reason]
		});
	}
	
	return res.status(200).json({ success: true });
};
//-----------------------------------------------------------------------------------------------//
export function showResolveNameConflicts(req, res) {
	return res.render('game/turn/resolve-name-conflicts');
};*/
//-----------------------------------------------------------------------------------------------//
export async function triggerProcessActions(req, res) {
	await processActions();
	
	return res.sendStatus(204);
};
//-----------------------------------------------------------------------------------------------//
export function showStatistics(req, res) {
	return res.render('game/statistics');
};


/*import { 
	ConflictError
} from '#utils/errors.js';

import { 
	MSG_NO_NEW_CHARACTERS,
	MSG_CHARACTER_NAME_TAKEN
} from '#constants/game.messages.js';

import { 
	BUILDING_SIZES
} from '#constants/game.rules.js';

import { 
	enterWorldSchema
} from '#validation/game.validation.js';

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
	getOwnedConstructionSites,
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
} from '#helpers/game/turn/manage-group.helpers.js';*/


	/*try {
		
		
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
			await setManageEmploymentContracts(
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
			);
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
	}*/

/*export const startTurn = async (req, res) => {
	const { character } = req.session;

	const turn = await composeTurn(characterId);
	
	res.render('game/turn/start', {
		products: turn.products,
		recreations: turn.recreations,
		buildings: turn.buildings,
		sizes: BUILDING_SIZES,
		characterState: turn.characterState,
		characterActions: turn.characterActions,
		actionPages: buildActionPages(turn.turnData),
		finished: turn.turnData.finished
	});
*/

/*
// constants/turnFlow.js
export function buildActionPages(turnData) {
	return ACTION_PAGES.map(p => ({
		key: p.key,
		url: p.url,
		isRelevant: p.isRelevant(turnData)
	}));
}




	return {
		products: turn.products,
		recreations: turn.recreations,
		buildings: turn.buildings,
		sizes: BUILDING_SIZES,
		characterState: turn.characterState,
		characterActions: turn.characterActions,
		actionPages: buildActionPages(turn.turnData),
		finished: turn.turnData.finished
	};*/
		
/*		
		const [
			products,
			recreations,
			buildings,
			turnData,
			ownedResources,
			ownedProducts,
			ownedConstructionSites,
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
			getOwnedConstructionSites(characterId),
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
			ownedConstructionSites,
			ownedBuildings,
			employeeContracts,
			employerContracts,
			tenantAgreements,
			landlordAgreements
		};
		
		const characterActions = {
			customizeCharacter,
			manageBuildings,
			manageEmploymentContracts,
			manageRentalAgreements,
			produce,
			trade,
			share,
			consume,
			manageGroup
		};
		
		const actionPages = [
			{
				key: 'customizeCharacter',
				url: '/game/turn/customize-character',
				isRelevant: !turnData.isCharacterCustomized
			},
			{
				key: 'manageBuildings',
				url: '/game/turn/manage-buildings',
				isRelevant: true
			},
			{
				key: 'manageEmploymentContracts',
				url: '/game/turn/manage-employment-contracts',
				isRelevant: true
			},
			{
				key: 'manageRentalAgreements',
				url: '/game/turn/manage-rental-agreements',
				isRelevant: true
			},
			{
				key: 'produce',
				url: '/game/turn/produce',
				isRelevant: true
			},
			{
				key: 'trade',
				url: '/game/turn/trade',
				isRelevant: true
			},
			{
				key: 'share',
				url: '/game/turn/share',
				isRelevant: true
			},
			{
				key: 'consume',
				url: '/game/turn/consume',
				isRelevant: true
			},
			{
				key: 'manageGroup',
				url: '/game/turn/manage-group',
				isRelevant: true
			}
		];
		
		res.render('game/turn/start', {
			products,
			recreations,
			buildings,
			sizes: BUILDING_SIZES,
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
*/