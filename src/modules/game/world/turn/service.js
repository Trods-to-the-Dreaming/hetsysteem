import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
/*import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';*/
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
	birthTurnSchema,
	normalTurnSchema,
	validateActions
} from './validation.js';
import {
	listProducts,
	listRecreations,
	listBuildings,
	listJobs,
	findTurn,
	updateTurn,
	findCharacter,
	findCharacterState,
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
	deleteUnusedCooperative,
	startProcessActions,
	finishProcessActions
} from './repository.js';

//===============================================================================================//

export function loadTurn({ userId, worldId }) {
    return knex.transaction(async (trx) => {
        const { isSaved } = await findTurn({
            userId,
            worldId,
            trx
        });

        const character = await findCharacter({
            userId,
            worldId,
            trx
        });

        if (!character) {
            const turn = await loadBirthTurn({
                characterId: null,
                trx
            });

            return {
                ...turn,
                isSaved
            };
        }

        const characterId = character.id;

        await cleanUp({
            characterId,
            trx
        });

        const characterState = await findCharacterState({
            characterId,
            trx
        });

        const turn = characterState
            ? await loadNormalTurn({
                characterId,
                characterState,
                trx
            })
            : await loadBirthTurn({
                characterId,
                trx
            });

        return {
            ...turn,
            isSaved
        };
    });
}
//-----------------------------------------------------------------------------------------------//
export function saveTurn({ userId, 
						   worldId,
						   actions }) {
	return knex.transaction(async (trx) => {
		const character = await findCharacter({
			userId,
			worldId,
			trx
		});
		
		const characterId = character.id;

		const characterState = await findCharacterState({
			characterId,
			trx
		}); 
		
		if (characterState) {
			await saveNormalTurn({
				characterId,
				actions,
				trx
			});
		} else {
			await saveBirthTurn({
				characterId,
				actions,
				trx
			});
		}
		
		await updateTurn({
			userId,
			worldId,
			trx
		});
		
		await cleanUp({
			characterId,
			trx
		});
	});
}
//-----------------------------------------------------------------------------------------------//
export async function processTurn() {
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

//===============================================================================================//

async function cleanUp({ characterId,
						 trx = knex }) {
	await deleteAllUnusedCharacterBuildings({
		characterId,
		trx
	});
	
	await deleteUnusedCooperative({
		characterId,
		trx
	});
}
//-----------------------------------------------------------------------------------------------//
async function loadNormalTurn({ characterId,
								characterState,
								trx }) {
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
		findOwnedProducts({ characterId, trx }),
		findOwnedBuildings({ characterId, trx }),
		findOwnedReservedBuildings({ characterId, trx }),
		findOwnedConstructionSites({ characterId, trx }),
		findEmployeeContracts({ characterId, trx }),
		findEmployerContracts({ characterId, trx }),
		findSelfEmploymentContracts({ characterId, trx }),
		findTenantAgreements({ characterId, trx }),
		findLandlordAgreements({ characterId, trx }),
		loadManageBuildings({ characterId, trx }),
		loadManageEmploymentContracts({ characterId, trx }),
		loadManageRentalAgreements({ characterId, trx }),
		loadProduce({ characterId, trx }),
		loadTrade({ characterId, trx }),
		loadShare({ characterId, trx }),
		loadConsume({ characterId, trx }),
		loadManageCooperative({ characterId, trx })
	]);
	
	return {
		constants: {
			products,
			buildings
		},
		state: {
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
		actions: {
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
		]
	};
}
//-----------------------------------------------------------------------------------------------//
async function loadBirthTurn({ characterId,
							   trx }) {
	const [
		jobs,
		recreations,
		createCharacter,
		manageCooperative
	] = await Promise.all([
		listJobs(),
		listRecreations(),
		loadCreateCharacter({ characterId, trx }),
		loadManageCooperative({ characterId, trx })
	]);
	
	return {
		constants: {
			jobs,
			recreations
		},
		state: null,
		actions: {
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
		]
	};
}
//-----------------------------------------------------------------------------------------------//
async function saveNormalTurn({ characterId,
								actions,
								trx }) {
	const validatedActions = validateActions(
		normalTurnSchema,
		actions
	);
	
	const {
		manageBuildings,
		manageEmploymentContracts,
		manageRentalAgreements,
		produce,
		trade,
		share,
		consume,
		manageCooperative
	} = validatedActions;
	
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
}
//-----------------------------------------------------------------------------------------------//
async function saveBirthTurn({ characterId,
							   actions,
							   trx }) {
	const validatedActions = validateActions(
		birthTurnSchema,
		actions
	);
	
	const {
		createCharacter,
		manageCooperative
	} = validatedActions;

	await saveCreateCharacter({ 
		characterId,
		createCharacter,
		trx
	});
	await saveManageCooperative({ 
		characterId,
		manageCooperative,
		trx
	});
}