import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
import { 
	loadCreateCharacter,
	saveCreateCharacter,
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
	loadManageCooperative,
	saveManageCooperative,
	processManageCooperative
} from './manage-cooperative/service.js';
import {
	listProducts,
	listRecreations,
	listBuildings,
	listJobs,
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
	findSelfEmploymentContracts,
	findTenantAgreements,
	findLandlordAgreements,
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
	
	OOK UNUSED CHARACTER NAMES, COOPERATIVE NAMES, ...
}
//-----------------------------------------------------------------------------------------------//
async function loadRegularTurn({ characterId,
								 characterState,
								 turnSaved }) {
	const [
		products,
		buildings,
		ownedProducts,
		ownedBuildings,
		ownedReservedBuildings,
		ownedConstructionSites,
		employeeContracts,
		employerContracts,
		selfEmploymentContracts,
		tenantAgreements,
		landlordAgreements,
		manageBuildings,
		manageEmploymentContracts,
		manageRentalAgreements,
		produce,
		trade,
		share,
		consume,
		manageCooperative
	] = await Promise.all([
		listProducts(),
		listBuildings(),
		findOwnedProducts({ characterId }),
		findOwnedBuildings({ characterId }),
		findOwnedReservedBuildings({ characterId }),
		findOwnedConstructionSites({ characterId }),
		findEmployeeContracts({ characterId }),
		findEmployerContracts({ characterId }),
		findSelfEmploymentContracts({ characterId }),
		findTenantAgreements({ characterId }),
		findLandlordAgreements({ characterId }),
		loadManageBuildings({ characterId }),
		loadManageEmploymentContracts({ characterId }),
		loadManageRentalAgreements({ characterId }),
		loadProduce({ characterId }),
		loadTrade({ characterId }),
		loadShare({ characterId }),
		loadConsume({ characterId }),
		loadManageCooperative({ characterId })
	]);
	
	return {
		constants: {
			products,
			buildings
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
			selfEmploymentContracts,
			tenantAgreements,
			landlordAgreements
		},
		characterPhases: {
			manageBuildings,
			manageEmploymentContracts,
			manageRentalAgreements,
			produce,
			trade,
			share,
			consume,
			manageCooperative
		},
		phases: [
			{
				key: 'manageBuildings',
				url: '/game/world/turn/manage-buildings'
			},
			{
				key: 'manageEmploymentContracts',
				url: '/game/world/turn/manage-employment-contracts'
			},
			{
				key: 'manageRentalAgreements',
				url: '/game/world/turn/manage-rental-agreements'
			},
			{
				key: 'produce',
				url: '/game/world/turn/produce'
			},
			{
				key: 'trade',
				url: '/game/world/turn/trade'
			},
			{
				key: 'share',
				url: '/game/world/turn/share'
			},
			{
				key: 'manageTime',
				url: '/game/world/turn/manage-time'
			},
			{
				key: 'consume',
				url: '/game/world/turn/consume'
			},
			{
				key: 'manageCooperative',
				url: '/game/world/turn/manage-cooperative'
			}
		],
		turnSaved
	};
}
//-----------------------------------------------------------------------------------------------//
async function loadBirthTurn({ characterId,
							   turnSaved }) {
	const [
		jobs,
		recreations,
		createCharacter,
		manageCooperative
	] = await Promise.all([
		listJobs(),
		listRecreations(),
		loadCreateCharacter({ characterId }),
		loadManageCooperative({ characterId })
	]);
	
	return {
		constants: {
			jobs,
			recreations
		},
		characterPhases: {
			createCharacter,
			manageCooperative
		},
		phases: [
			{
				key: 'createCharacter',
				url: '/game/world/turn/create-character'
			},
			{
				key: 'manageCooperative',
				url: '/game/world/turn/manage-cooperative'
			}
		 ],
		turnSaved
	};
}

//===============================================================================================//

export async function loadTurn({ userId,
								 worldId }) {
	const character = await findCharacter({
		userId,
		worldId
	});
	
	if (!character) {
		return loadCreateCharacterTurn({ 
			characterId: null,
			turnSaved: false
		});
	}
	
	const characterState = await findCharacterState({ 
		characterId: character.id 
	});
	
	if (!characterState) {
		return loadBirthTurn({ 
			characterId: character.id,
			turnSaved: character.turnSaved
		});
	}
	
	return loadRegularTurn({ 
		characterId: character.id,
		characterState,
		turnSaved: character.turnSaved
	});
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
		
		await cleanUp({
			characterId,
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
		manageCooperative
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
		await saveManageCooperative({ 
			characterId,
			manageCooperative,
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
export async function checkTurnVersion({ userId,
										 worldId,
										 turnVersion }) {
	const character = await findEditableCharacter({
		userId,
		worldId,
		turnVersion
	});
	
	return Boolean(character);
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
			await processManageCooperative(trx);
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