import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
/*import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';*/
//-----------------------------------------------------------------------------------------------//
import { 
	url as createCharacterURL,
	loadActions as loadCreateCharacterActions,
	saveActions as saveCreateCharacterActions,
	processActions as processCreateCharacterActions 
} from './create-character/service.js';
import { 
	url as manageBuildingsURL,
	loadActions as loadManageBuildingsActions,
	saveActions as saveManageBuildingsActions,
	processActions as processManageBuildingsActions
} from './manage-buildings/service.js';
import { 
	url as manageEmploymentContractsURL,
	loadActions as loadManageEmploymentContractsActions,
	saveActions as saveManageEmploymentContractsActions,
	processActions as processManageEmploymentContractsActions
} from './manage-employment-contracts/service.js';
import { 
	url as manageRentalAgreementsURL,
	loadActions as loadManageRentalAgreementsActions,
	saveActions as saveManageRentalAgreementsActions,
	processActions as processManageRentalAgreementsActions
} from './manage-rental-agreements/service.js';
import { 
	url as produceURL,
	loadActions as loadProduceActions,
	saveActions as saveProduceActions,
	processActions as processProduceActions
} from './produce/service.js';
import { 
	url as tradeURL,
	loadActions as loadTradeActions,
	saveActions as saveTradeActions,
	processActions as processTradeActions
} from './trade/service.js';
import { 
	url as shareURL,
	loadActions as loadShareActions,
	saveActions as saveShareActions,
	processActions as processShareActions
} from './share/service.js';
import { 
	url as consumeURL,
	loadActions as loadConsumeActions,
	saveActions as saveConsumeActions,
	processActions as processConsumeActions
} from './consume/service.js';
import { 
	url as manageCooperativeURL,
	loadActions as loadManageCooperativeActions,
	saveActions as saveManageCooperativeActions,
	processActions as processManageCooperativeActions
} from './manage-cooperative/service.js';
import {
	birthTurnSchema,
	normalTurnSchema,
	validatePhaseActions
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
	findCooperative,
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
                character: null,
                trx
            });

            return {
                ...turn,
                isSaved
            };
        }

        await cleanUp({
            characterId: character.id,
            trx
        });

        const characterState = await findCharacterState({
            characterId: character.id,
            trx
        });

        const turn = characterState
            ? await loadNormalTurn({
                character,
                characterState,
                trx
            })
            : await loadBirthTurn({
                character,
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
						   phaseActions }) {
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
				phaseActions,
				trx
			});
		} else {
			await saveBirthTurn({
				characterId,
				phaseActions,
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
	/*const [runId] = await startProcessActions();
	
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
	}*/
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
async function loadNormalTurn({ character,
								characterState,
								trx }) {
	const characterId = character.id;
	
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
		cooperative,
		manageBuildingsActions,
		manageEmploymentContractsActions,
		manageRentalAgreementsActions,
		produceActions,
		tradeActions,
		shareActions,
		consumeActions,
		manageCooperativeActions
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
		findCooperative({ characterId, trx }),
		loadManageBuildingsActions({ characterId, trx }),
		loadManageEmploymentContractsActions({ characterId, trx }),
		loadManageRentalAgreementsActions({ characterId, trx }),
		loadProduceActions({ characterId, trx }),
		loadTradeActions({ characterId, trx }),
		loadShareActions({ characterId, trx }),
		loadConsumeActions({ characterId, trx }),
		loadManageCooperativeActions({ characterId, trx })
	]);
	
	return {
		constants: {
			products,
			buildings
		},
		character: {
			firstName: character.firstName,
			lastName: character.lastName,
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
			landlordAgreements,
			cooperative
		},
		phaseActions: {
			manageBuildingsActions,
			manageEmploymentContractsActions,
			manageRentalAgreementsActions,
			produceActions,
			tradeActions,
			shareActions,
			consumeActions,
			manageCooperativeActions
		},
		phaseURLs: [
			manageBuildingsURL,
			manageEmploymentContractsURL,
			manageRentalAgreementsURL,
			produceURL,
			tradeURL,
			shareURL,
			manageTimeURL,
			consumeURL,
			manageCooperativeURL
		]
	};
}
//-----------------------------------------------------------------------------------------------//
async function loadBirthTurn({ character,
							   trx }) {
	const characterId = character?.id ?? null;
	
	const [
		jobs,
		recreations,
		createCharacterActions,
		manageCooperativeActions
	] = await Promise.all([
		listJobs(),
		listRecreations(),
		loadCreateCharacterActions({ characterId, trx }),
		loadManageCooperativeActions({ characterId, trx })
	]);
	
	return {
		constants: {
			jobs,
			recreations
		},
		character: {
			firstName: character?.firstName ?? null,
			lastName: character?.lastName ?? null
		},
		phaseActions: {
			createCharacterActions,
			manageCooperativeActions
		},
		phaseURLs: [
			createCharacterURL,
			manageCooperativeURL
		]
	};
}
//-----------------------------------------------------------------------------------------------//
async function saveNormalTurn({ characterId,
								phaseActions,
								trx }) {
	const validatedPhaseActions = validatePhaseActions({
		turnSchema: normalTurnSchema,
		phaseActions
	});
	
	const {
		manageBuildingsActions,
		manageEmploymentContractsActions,
		manageRentalAgreementsActions,
		produceActions,
		tradeActions,
		shareActions,
		consumeActions,
		manageCooperativeActions
	} = validatedPhaseActions;
	
	await saveManageBuildingsActions({ 
		characterId,
		actions: manageBuildingsActions,
		trx
	});
	await saveManageEmploymentContractsActions({ 
		characterId,
		actions: manageEmploymentContractsActions,
		trx
	});
	await saveManageRentalAgreementsActions({ 
		characterId,
		actions: manageRentalAgreementsActions,
		trx
	});
	await saveProduceActions({ 
		characterId,
		actions: produceActions,
		trx
	});
	await saveTradeActions({ 
		characterId,
		actions: tradeActions,
		trx
	});
	await saveShareActions({ 
		characterId,
		actions: shareActions,
		trx
	});
	await saveConsumeActions({ 
		characterId,
		actions: consumeActions,
		trx
	});
	await saveManageCooperativeActions({ 
		characterId,
		actions: manageCooperativeActions,
		trx
	});
}
//-----------------------------------------------------------------------------------------------//
async function saveBirthTurn({ characterId,
							   phaseActions,
							   trx }) {
	const validatedPhaseActions = validatePhaseActions({
		turnSchema: birthTurnSchema,
		phaseActions
	});
	
	const {
		createCharacterActions,
		manageCooperativeActions
	} = validatedPhaseActions;

	await saveCreateCharacterActions({ 
		characterId,
		actions: createCharacterActions,
		trx
	});
	await saveManageCooperativeActions({ 
		characterId,
		actions: manageCooperativeActions,
		trx
	});
}