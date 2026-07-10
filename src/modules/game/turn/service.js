import knex from '#utils/db.js';
/*import { 
	BadRequestError 
} from '#utils/errors.js';*/
import { 
	ok, 
	fail 
} from '#utils/result.js';
//-----------------------------------------------------------------------------------------------//
import { 
	BUILDING_SIZES 
} from '#modules/game/rules.js';
import { 
	PHASES 
} from '#modules/game/turn/config.js';
import { 
	GameError 
} from '#modules/game/errors.js';
import { 
	GAME
} from '#modules/game/reasons.js';
//-----------------------------------------------------------------------------------------------//
/*import {
	getProducts,
	getRecreations,
	getBuildings
} from './../static-data/service.js';
import {
	loadCharacterState
} from './character-state/service.js';*/
import { 
	processCreateCharacter
} from './create-character/service.js';
import { 
	loadManageBuildings,
	saveManageBuildings,
	processManageBuildings
} from './manage-buildings/service.js';
import { 
	loadManageEmploymentContracts,
	saveManageEmploymentContracts,
	processManageEmploymentContracts
} from './manage-employment-contracts/service.js';
import { 
	loadManageRentalAgreements,
	saveManageRentalAgreements,
	processManageRentalAgreements
} from './manage-rental-agreements/service.js';
import { 
	loadProduce,
	saveProduce,
	processProduce
} from './produce/service.js';
import { 
	loadTrade,
	saveTrade,
	processTrade
} from './trade/service.js';
import { 
	loadShare,
	saveShare,
	processShare
} from './share/service.js';
import { 
	loadConsume,
	saveConsume,
	processConsume
} from './consume/service.js';
import { 
	loadManageGroup,
	saveManageGroup,
	processManageGroup
} from './manage-group/service.js';
import {
	/*findOtherCustomizeAction,
	findBuilding,
	findOtherConstructAction,*/
	listProducts,
	listBuildings,
	findEditableCharacter,
	findCharacter,
	findCharacterState,
	incrementTurnEditVersion,
	findTurnEditVersion,
	findOwnedProducts,
	findOwnedBuildings,
	findOwnedReservedBuildings,
	findOwnedConstructionSites,
	findEmployeeContracts,
	findEmployerContracts,
	findSelfEmploymentContracts,/*
	findTenantAgreements,
	findLandlordAgreements,*/
	insertCharacterBuilding,
	deleteUnusedCharacterBuilding,
	deleteAllUnusedCharacterBuildings,
	startProcessActions,
	finishProcessActions
} from './repository.js';

//===============================================================================================//

async function cleanUp({ characterId,
						 trx = knex }) {
	await deleteAllUnusedCharacterBuildings({
		characterId,
		trx
	});
}

//===============================================================================================//

export async function loadTurn({ userId,
								 worldId }) {
	const { id: characterId } = await findCharacter({
		userId,
		worldId
	});

	const [
		products,
		buildings,
		characterState,
		ownedProducts,
		ownedBuildings,
		ownedReservedBuildings,
		ownedConstructionSites,
		employeeContracts,
		employerContracts,
		selfEmploymentContracts,/*
		tenantAgreements,
		landlordAgreements,*/
		manageBuildings,
		manageEmploymentContracts,
		manageRentalAgreements,
		produce,
		trade,
		share,
		consume,
		manageGroup
	] = await Promise.all([
		listProducts(),
		listBuildings(),
		findCharacterState({ characterId }),
		findOwnedProducts({ characterId }),
		findOwnedBuildings({ characterId }),
		findOwnedReservedBuildings({ characterId }),
		findOwnedConstructionSites({ characterId }),
		findEmployeeContracts({ characterId }),
		findEmployerContracts({ characterId }),
		findSelfEmploymentContracts({ characterId }),/*
		findTenantAgreements({ characterId }),
		findLandlordAgreements({ characterId }),*/
		loadManageBuildings({ characterId }),
		loadManageEmploymentContracts({ characterId }),
		loadManageRentalAgreements({ characterId }),
		loadProduce({ characterId }),
		loadTrade({ characterId }),
		loadShare({ characterId }),
		loadConsume({ characterId }),
		loadManageGroup({ characterId })
	]);
	
	return {
		constants: {
			products,
			buildings,
			buildingSizes: BUILDING_SIZES
		},
		characterState: {
			hoursAvailable: characterState.hoursAvailable,
			ownedTiles: characterState.ownedTiles,
			ownedProducts,
			ownedBuildings,
			ownedReservedBuildings,
			ownedConstructionSites,
			employeeContracts,
			employerContracts,
			selfEmploymentContracts/*,
			tenantAgreements,
			landlordAgreements*/
		},
		characterPhases: {
			manageBuildings,
			manageEmploymentContracts,
			manageRentalAgreements,
			produce,
			trade,
			share,
			consume,
			manageGroup
		},
		phases: PHASES,
		saved: characterState.turnSaved
	};
}
//-----------------------------------------------------------------------------------------------//
export async function startTurn({ userId, 
								  worldId }) {
	
	return await knex.transaction(async (trx) => {
		const { id: characterId } = await findCharacter({
			userId,
			worldId,
			trx
		});
		
		await incrementTurnEditVersion({ 
			characterId, 
			trx 
		});

		const { turnEditVersion } = await findTurnEditVersion({
			characterId,
			trx
		});
		
		return { turnEditVersion };
	});
}
//-----------------------------------------------------------------------------------------------//
export async function saveTurn({ userId, 
								 worldId, 
								 characterPhases }) {
	const {
		manageBuildings,
		manageEmploymentContracts,
		manageRentalAgreements,
		produce,
		trade,
		share,
		consume,
		manageGroup
	} = characterPhases;
	
	await knex.transaction(async (trx) => {
		const { id: characterId } = await findCharacter({
			userId,
			worldId,
			trx
		});
		
		await saveManageBuildings({ 
			characterId,
			manageBuildings,
			trx
		});
		await saveManageEmploymentContracts({ 
			characterId,
			manageEmploymentContracts,
			trx
		});
		await saveManageRentalAgreements({ 
			characterId,
			manageRentalAgreements,
			trx
		});
		await saveProduce({ 
			characterId,
			produce,
			trx
		});
		await saveTrade({ 
			characterId,
			trade,
			trx
		});
		await saveShare({ 
			characterId,
			share,
			trx
		});
		await saveConsume({ 
			characterId,
			consume,
			trx
		});
		await saveManageGroup({ 
			characterId,
			manageGroup,
			trx
		});
		await cleanUp({
			characterId,
			trx
		});
		await updateCharacterState({
			characterId,
			trx
		});
	});
}
//-----------------------------------------------------------------------------------------------//
export async function checkTurnEditVersion({ userId,
											 worldId,
											 turnEditVersion }) {
	const character = await findEditableCharacter({
		userId,
		worldId,
		turnEditVersion
	});
	
	return Boolean(character);
}
//-----------------------------------------------------------------------------------------------//
export async function reserveBuildingName({ userId, 
											worldId, 
											characterBuildingName }) {
	try {
		return await knex.transaction(async (trx) => {
			const { id: characterId } = await findCharacter({
				userId,
				worldId,
				trx
			});
			
			let characterBuildingId;
			try {
				[characterBuildingId] = await insertCharacterBuilding({
					characterId,
					worldId,
					characterBuildingName,
					trx
				});
			} catch (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					throw new GameError({ 
						status: 409,
						code: GAME.REASON.BUILDING_NAME_TAKEN 
					});
				}
				
				throw err;
			}
			
			return ok({ 
				characterBuildingId,
				characterBuildingName 
			});
		});
	} catch (err) {
		if (err instanceof GameError) {
            return fail({ 
				status: err.status,
				reason: err.code 
			});
		}
        
        throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function cancelBuildingName({ userId, 
										   worldId, 
										   characterBuildingId }) {
	return await knex.transaction(async (trx) => {
		const { id: characterId } = await findCharacter({
			userId,
			worldId,
			trx
		});
		
		await deleteUnusedCharacterBuilding({
			characterBuildingId,
			characterId,
			trx
		});
	});
}
//-----------------------------------------------------------------------------------------------//
export async function processActions() {
	const [runId] = await startProcessActions();
	
	try {
		await knex.transaction(async (trx) => {
			await processCreateCharacter(trx);
			await processManageBuildings(trx);
			await processManageEmploymentContracts(trx);
			await processManageRentalAgreements(trx);
			await processProduce(trx);
			await processTrade(trx);
			await processShare(trx);
			await processConsume(trx);
			await processManageGroup(trx);
			//await processFinishTurn(trx);
		});

		await finishProcessActions({ 
			runId, 
			status: 'success'
		});
	} catch (err) {
		await finishProcessActions({ 
			runId, 
			status: 'failed', 
			errorMessage: err.message
		});
		
		throw err;
	}
}