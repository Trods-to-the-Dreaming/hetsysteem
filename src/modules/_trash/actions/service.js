import { BadRequestError } from '#utils/errors.js';

import { YEARS_PER_TURN } from './../rules.js';

import {
	getProducts,
	getRecreations,
	getBuildings // deze 3 functies halen statische data op
} from './../static-data/service.js';

import {
	findTurnData,
	findOwnedResources,
	findOwnedProducts,
	findOwnedConstructionSites,
	findOwnedBuildings,
	findEmployeeContracts,
	findEmployerContracts,
	findTenantAgreements,
	findLandlordAgreements, // deze 9 functies halen de huidige speltoestand op
	
	findCustomizeCharacter,
	findManageBuildings,
	findManageEmploymentContracts,
	findManageRentalAgreements,
	findProduce,
	findTrade,
	findShare,
	findConsume,
	findManageGroup // deze 9 functies halen de voorlopig bewaarde acties voor de volgende beurt op
} from './repository.js';

import {
	findCharacterState,
	findWorldState
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_CHARACTER = 'Dit personage bestaat niet.';
const MSG_INVALID_WORLD		= 'Deze wereld bestaat niet.';

//===============================================================================================//

export async function buildTurnView(characterId) {
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
		findCustomizeCharacter(characterId),
		findManageBuildings(characterId),
		findManageEmploymentContracts(characterId),
		findManageRentalAgreements(characterId),
		findProduce(characterId),
		findTrade(characterId),
		findShare(characterId),
		findConsume(characterId),
		findManageGroup(characterId)
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