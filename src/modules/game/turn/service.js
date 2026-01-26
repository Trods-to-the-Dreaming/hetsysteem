import knex from '#utils/db.js';
/*import { 
	BadRequestError 
} from '#utils/errors.js';*/
//-----------------------------------------------------------------------------------------------//
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
	/*loadCustomizeCharacter,
	saveCustomizeCharacter,
	processCustomizeCharacter*/
} from './create-character/service.js';
/*import { 
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
} from './manage-group/service.js';*/
import {
	/*findCharacter,
	findOtherCustomizeAction,
	findBuilding,
	findOtherConstructAction,*/
	startProcessActions,
	finishProcessActions
} from './repository.js';


//===============================================================================================//

/*export async function buildTurnView(characterId) {
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
		findTurnData(characterId),
		findOwnedResources(characterId),
		findOwnedProducts(characterId),
		findOwnedConstructionSites(characterId),
		findOwnedBuildings(characterId),
		findEmployeeContracts(characterId),
		findEmployerContracts(characterId),
		findTenantAgreements(characterId),
		findLandlordAgreements(characterId),
		loadCustomizeCharacter(characterId),
		loadManageBuildings(characterId),
		loadManageEmploymentContracts(characterId),
		loadManageRentalAgreements(characterId),
		loadProduce(characterId),
		loadTrade(characterId),
		loadShare(characterId),
		loadConsume(characterId),
		loadManageGroup(characterId)
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
	
	return {
		products,
		recreations,
		buildings,
		turnData,
		characterState,
		characterActions
	};
	
	
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
}
//-----------------------------------------------------------------------------------------------//
export async function finishTurn({ characterId, 
								   worldId, 
								   phases }) {
	try {
		await knex.transaction(async (trx) => {
			await saveCustomizeCharacter({ 
				characterId,
				phase: phases.customizeCharacter,
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
	} catch (err) {
		if (err instanceof ConflictError) {
			return fail({
				reason: err.code,
				meta: err.meta
			});
		}
		
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function checkCharacterName({ selfId, 
										   worldId, 
										   firstName, 
										   lastName }) {
	const lowerCaseFirstName = firstName.toLowerCase();
	const lowerCaseLastName = lastName.toLowerCase();
	
	const character = await findCharacter({ 
		worldId, 
		lowerCaseFirstName, 
		lowerCaseLastName
	});
	if (character) 
		return fail({ reason: GAME.REASON.CHARACTER_NAME_TAKEN });
	
	const action = await findOtherCustomizeAction({ 
		selfId,
		worldId,
		lowerCaseFirstName, 
		lowerCaseLastName
	});
	if (action) 
		return fail({ reason: GAME.REASON.CHARACTER_NAME_TAKEN });
	
	return ok();
}
//-----------------------------------------------------------------------------------------------//
export async function checkBuildingName({ selfId, 
										  worldId, 
										  buildingName }) {
	const lowerCaseBuildingName = buildingName.toLowerCase();
	
	const building = await findBuilding({ 
		worldId, 
		lowerCaseBuildingName
	});
	if (building) 
		return fail({ reason: GAME.REASON.BUILDING_NAME_TAKEN });
	
	const action = await findOtherConstructAction({
		selfId,
		worldId, 
		lowerCaseBuildingName
	});
	if (action) 
		return fail({ reason: GAME.REASON.BUILDING_NAME_TAKEN });
	
	return ok();
}*/
//-----------------------------------------------------------------------------------------------//
export async function processActions() {
	const [runId] = await startProcessActions();
	
	try {
		await knex.transaction(async (trx) => {
			await processCreateCharacter(trx);
			/*await processManageBuildings(trx);
			await processManageEmploymentContracts(trx);
			await processManageRentalAgreements(trx);
			await processProduce(trx);
			await processTrade(trx);
			await processShare(trx);
			await processConsume(trx);
			await processManageGroup(trx);
			await processFinishTurn(trx);*/ // voorlopig uitgeschakeld om te testen
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