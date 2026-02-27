import knex from '#utils/db.js';
/*import { 
	BadRequestError 
} from '#utils/errors.js';*/
//-----------------------------------------------------------------------------------------------//
import { 
	BUILDING_SIZES 
} from '#modules/game/rules.js';
import { 
	PHASE_PAGES 
} from '#modules/game/turn/config.js';
/*import { 
	GAME
} from './../reasons.js';
import {
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
	findCharacter,
	findCharacterState,
	findOwnedProducts,
	findOwnedBuildings,
	findOwnedReservedBuildings,
	findOwnedConstructionSites,
	/*findEmployerContracts,
	findEmployeeContracts,
	findTenantAgreements,
	findLandlordAgreements,*/
	insertCharacterBuilding,
	deleteCharacterBuilding,
	startProcessActions,
	finishProcessActions
} from './repository.js';

//===============================================================================================//

export async function buildTurnView({ userId,
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
		/*employeeContracts,
		employerContracts,
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
		/*findEmployeeContracts({ characterId }),
		findEmployerContracts({ characterId }),
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
		products,
		buildings,
		sizes: BUILDING_SIZES,
		characterState: {
			hoursAvailable: characterState.hoursAvailable,
			ownedTiles: characterState.ownedTiles,
			ownedProducts,
			ownedBuildings,
			ownedReservedBuildings,
			ownedConstructionSites/*,
			employeeContracts,
			employerContracts,
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
		phasePages: PHASE_PAGES,
		hasFinishedTurn: characterState.hasFinishedTurn
	};
}
//-----------------------------------------------------------------------------------------------//
export async function finishTurn({ userId, 
								   worldId, 
								   phases }) {
	await knex.transaction(async (trx) => {
		const { id: characterId } = await findCharacter({
			userId,
			worldId,
			trx
		});
		
		await saveManageBuildings({ 
			characterId,
			phase: phases.manageBuildings,
			trx
		});
		await saveManageEmploymentContracts({ 
			characterId,
			phase: phases.manageEmploymentContracts,
			trx
		});
		await saveManageRentalAgreements({ 
			characterId,
			phase: phases.manageRentalAgreements,
			trx
		});
		await saveProduce({ 
			characterId,
			phase: phases.produce,
			trx
		});
		await saveTrade({ 
			characterId,
			phase: phases.trade,
			trx
		});
		await saveShare({ 
			characterId,
			phase: phases.share,
			trx
		});
		await saveConsume({ 
			characterId,
			phase: phases.consume,
			trx
		});
		await saveManageGroup({ 
			characterId,
			phase: phases.manageGroup,
			trx
		});
	});
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
			
			return ok(characterBuildingId);
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
		
		await deleteCharacterBuilding({
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
			await processFinishTurn(trx);
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