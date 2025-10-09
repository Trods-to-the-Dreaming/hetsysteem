//=== Imports ===================================================================================//
import knex from '../utils/db.js';
import { 
	BadRequestError 
} from '../utils/errors.js';

import { 
	MSG_INVALID_CHARACTER
} from '../constants/game.messages.js';

//=== Main ======================================================================================//

//--- Is character name available? --------------------------------------------------------------//
export const isCharacterNameAvailable = async (selfId,
											   worldId, 
											   firstName, 
											   lastName,
											   trx = knex) => {
	const duplicate = await trx('characters')
		.select(1)
		.where('id', '!=', selfId)
		.andWhere('world_id', worldId)
		.andWhereRaw('LOWER(first_name) = ?', firstName.toLowerCase())
		.andWhereRaw('LOWER(last_name) = ?', lastName.toLowerCase())
		.first();
	return !duplicate;
};

//--- Is building name available? --------------------------------------------------------------//
export const isBuildingNameAvailable = async (worldId, 
											  name,
											  trx = knex) => {
	const duplicate = await trx('character_buildings')
		.select(1)
		.where('world_id', worldId)
		.andWhereRaw('LOWER(name) = ?', name.toLowerCase())
		.first();
	return !duplicate;
};

//--- Get character state -----------------------------------------------------------------------//
export const getCharacterState = async (characterId,
										trx = knex) => {
	const state = await knex('characters')
		.select(
			'is_customized as isCustomized',
			'owned_tiles as ownedTiles',
			'hours_available as hoursAvailable'
		)
		.where('id', characterId)
		.first();

	if (!state) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	return state;
};

//--- Get character products --------------------------------------------------------------------//
export const getCharacterProducts = async (characterId,
										   trx = knex) => {
	const products = await knex('character_products')
		.select(
			'product_id as productId',
			'quantity'
		)
		.where('owner_id', characterId);
	
	return products;
};

//--- Get character buildings -------------------------------------------------------------------//
export const getCharacterBuildings = async (characterId,
											trx = knex) => {
	const buildings = await knex('character_buildings')
		.select(
			'id',
			'name',
			'size',
			'building_id as buildingId'
		)
		.where('owner_id', characterId);
	
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