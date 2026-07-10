import {
	findTurnData,
	findOwnedResources,
	findOwnedProducts,
	findOwnedConstructionSites,
	findOwnedBuildings,
	findEmployeeContracts,
	findEmployerContracts,
	findTenantAgreements,
	findLandlordAgreements
} from './repository.js';

//===============================================================================================//

export async function getCharacterState(characterId) {
	const [
		turnData,
		ownedResources,
		ownedProducts,
		ownedConstructionSites,
		ownedBuildings,
		employeeContracts,
		employerContracts,
		tenantAgreements,
		landlordAgreements
	] = await Promise.all([
		findTurnData(characterId),
		findOwnedResources(characterId),
		findOwnedProducts(characterId),
		findOwnedConstructionSites(characterId),
		findOwnedBuildings(characterId),
		findEmployeeContracts(characterId),
		findEmployerContracts(characterId),
		findTenantAgreements(characterId),
		findLandlordAgreements(characterId)
	]);
	
	return {
		...ownedResources,
		ownedProducts,
		ownedConstructionSites,
		ownedBuildings,
		employeeContracts,
		employerContracts,
		tenantAgreements,
		landlordAgreements
	};
}