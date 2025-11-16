//=== Imports ===================================================================================//
import knex from '#utils/db.js';
import { 
	BadRequestError 
} from '#utils/errors.js';

import { 
	MSG_INVALID_CHARACTER
} from '#constants/game.messages.js';

//=== Main ======================================================================================//

//--- Find character name -----------------------------------------------------------------------//
export const findCharacterName = async (firstName, 
										lastName,
										selfId,
										worldId,
										trx = knex) => {
	const lowerCaseFirstName = firstName.toLowerCase();
	const lowerCaseLastName = lastName.toLowerCase();
	
	const existingCharacter  = await trx('characters')
		.select(1)
		.where('id', '!=', selfId)
		.andWhere('world_id', worldId)
		.andWhereRaw('LOWER(first_name) = ?', lowerCaseFirstName)
		.andWhereRaw('LOWER(last_name) = ?', lowerCaseLastName)
		.first();
	
	if (existingCharacter) return existingCharacter;
	
	const reserved = await trx('action_customize as ac')
		.join('characters as c', 'ac.character_id', 'c.id')
		.select(1)
		.where('c.id', '!=', selfId)
		.andWhere('c.world_id', worldId)
		.andWhereRaw('LOWER(ac.first_name) = ?', lowerCaseFirstName)
		.andWhereRaw('LOWER(ac.last_name) = ?', lowerCaseLastName)
		.first();

	return reserved;
};

//--- Find building name ------------------------------------------------------------------------//
export const findBuildingName = async (buildingName,
									   worldId,
									   trx = knex) => {
	const lowerCaseName = buildingName.toLowerCase();
	
	const existingBuilding = await trx('character_buildings')
		.select(1)
		.where('world_id', worldId)
		.andWhereRaw('LOWER(name) = ?', lowerCaseName)
		.first();
	
	if (existingBuilding) return existingBuilding;
	
	const reserved = await trx('action_construct as ac')
		.join('characters as c', 'ac.owner_id', 'c.id')
		.select(1)
		.where('c.world_id', worldId)
		.andWhereRaw('LOWER(ac.name) = ?', lowerCaseName)
		.first();

	return reserved;
};

//--- Get character resources -------------------------------------------------------------------//
export const getCharacterResources = async (characterId,
										trx = knex) => {
	const resources = await knex('characters')
		.select(
			'is_customized as isCustomized',
			'owned_tiles as ownedTiles',
			'hours_available as hoursAvailable'
		)
		.where('id', characterId)
		.first();

	if (!resources) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	return resources;
};

//--- Get character products --------------------------------------------------------------------//
export const getCharacterProducts = async (characterId,
										   trx = knex) => {
	const products = await knex('character_products')
		.select(
			'product_id as productId',
			'quantity'
		)
		.where('owner_id', characterId)
		.orderBy('product_id', 'asc');
	
	return products;
};

//--- Get character buildings -------------------------------------------------------------------//
export const getCharacterBuildings = async (characterId,
											trx = knex) => {
	const buildings = await knex('character_buildings')
		.select(
			'id',
			'name',
			'size_factor as sizeFactor',
			'building_id as buildingId'
		)
		.where('owner_id', characterId)
		.orderBy('building_id', 'asc');
	
	return buildings;
};

//--- Get employee contracts --------------------------------------------------------------------//
export const getEmployeeContracts = async (characterId,
										   trx = knex) => {
	const contracts = await knex('employment_contracts as ec')
		.select(
			'ec.id as id',
			'cb.name as buildingName',
			'ec.working_hours as workingHours',
			'ec.hourly_wage as hourlyWage',
			'c.first_name as employerFirstName',
			'c.last_name as employerLastName'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ec.workplace_id')
		.innerJoin('characters as c', 'c.id', 'cb.owner_id')
		.where('ec.employee_id', characterId);
	
	return contracts;
};

//--- Get employer contracts --------------------------------------------------------------------//
export const getEmployerContracts = async (characterId, 
										   trx = knex) => {
	const contracts = await knex('employment_contracts as ec')
		.select(
			'ec.id as id',
			'cb.name as buildingName',
			'ec.working_hours as workingHours',
			'ec.hourly_wage as hourlyWage',
			'c.first_name as employeeFirstName',
			'c.last_name as employeeLastName'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ec.workplace_id')
		.innerJoin('characters as c', 'c.id', 'ec.employee_id')
		.where('cb.owner_id', characterId);
	
	return contracts;
};

//--- Get tenant agreements ---------------------------------------------------------------------//
export const getTenantAgreements = async (characterId, 
										  trx = knex) => {
	const agreements = await knex('rental_agreements as ra')
		.select(
			'ra.id as id',
			'cb.name as residenceName',
			'ra.daily_rent as dailyRent',
			'c.first_name as landlordFirstName',
			'c.last_name as landlordLastName'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ra.residence_id')
		.innerJoin('characters as c', 'c.id', 'cb.owner_id')
		.where('ra.tenant_id', characterId);
	
	return agreements;
};

//--- Get landlord agreements -------------------------------------------------------------------//
export const getLandlordAgreements = async (characterId, 
											trx = knex) => {
	const agreements = await knex('rental_agreements as ra')
		.select(
			'ra.id as id',
			'cb.name as residenceName',
			'ra.daily_rent as dailyRent',
			'c.first_name as tenantFirstName',
			'c.last_name as tenantLastName'
		)
		.innerJoin('character_buildings as cb', 'cb.id', 'ra.residence_id')
		.innerJoin('characters as c', 'c.id', 'ra.tenant_id')
		.where('cb.owner_id', characterId);
	
	return agreements;
};