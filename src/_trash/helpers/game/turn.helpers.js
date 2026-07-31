//=== Imports ===================================================================================//

import knex from '#utils/db.js';

import { 
	getProducts,
	getRecreations,
	getBuildings
} from '#helpers/game/static.helpers.js';

import { 
	getProducts,
	getRecreations,
	getBuildings
} from '#helpers/game/static.helpers.js';

import {
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
} from '#helpers/game/turn/manage-group.helpers.js';

//=== Main ======================================================================================//

export async function composeTurn(characterId) {
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
	
	return {
		products,
		recreations,
		buildings,
		turnData,
		characterState,
		characterActions
	};
}