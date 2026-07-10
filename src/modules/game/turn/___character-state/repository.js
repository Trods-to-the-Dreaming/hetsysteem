import knex from '#utils/db.js';

//===============================================================================================//

export function findTurnData({ characterId,
							   trx = knex }) {
	return trx('characters')
		.select({
			finished: 'has_finished_turn',
			isCharacterCustomized: 'is_customized'
		})
		.where('id', characterId)
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findOwnedResources({ characterId,
									 trx = knex }) {
	return trx('characters')
		.select({
			ownedTiles: 'owned_tiles',
			hoursAvailable: 'hours_available'
		})
		.where('id', characterId)
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findOwnedProducts({ characterId,
									trx = knex }) {
	return trx('character_products')
		.select({
			productId: 'product_id',
			quantity: 'quantity'
		})
		.where('character_id', characterId)
		.orderBy('product_id', 'asc');
};
//-----------------------------------------------------------------------------------------------//
export function findOwnedBuildings({ characterId,
									 trx = knex }) {
	return trx('character_buildings')
		.select({
			'id',
			'name',
			'size_factor as sizeFactor',
			'building_id as buildingId'
		})
		.where('character_id', characterId)
		.orderBy('building_id', 'asc');
};
//-----------------------------------------------------------------------------------------------//
export function findOwnedConstructionSites({ characterId,
											 trx = knex }) {
	return trx('character_construction_sites as ccs')
		.select({
			id: 'ccs.character_building_id',
			buildingId: 'ccs.building_id',
			bricksUsed: 'ccs.bricks_used',
			bricksNeeded: 'ccs.bricks_needed'
		})
		.innerJoin('character_buildings as cb', 'cb.id', 'ccs.character_building_id')
		.where('cb.character_id', characterId)
		.orderBy('ccs.building_id', 'asc');
};
//-----------------------------------------------------------------------------------------------//
export function findEmployeeContracts({ characterId,
									    trx = knex }) {
	return trx('employment_contracts as ec')
		.select({
			id: 'ec.id',
			buildingName: 'cb.name',
			workingHours: 'ec.working_hours',
			hourlyWage: 'ec.hourly_wage',
			employerFirstName: 'c.first_name',
			employerLastName: 'c.last_name'
		})
		.innerJoin('character_buildings as cb', 'cb.id', 'ec.workplace_id')
		.innerJoin('characters as c', 'c.id', 'cb.character_id')
		.where('ec.employee_id', characterId);
};
//-----------------------------------------------------------------------------------------------//
export function findEmployerContracts({ characterId, 
									    trx = knex }) {
	return trx('employment_contracts as ec')
		.select({
			id: 'ec.id',
			buildingName: 'cb.name',
			workingHours: 'ec.working_hours',
			hourlyWage: 'ec.hourly_wage',
			employeeFirstName: 'c.first_name',
			employeeLastName: 'c.last_name'
		})
		.innerJoin('character_buildings as cb', 'cb.id', 'ec.workplace_id')
		.innerJoin('characters as c', 'c.id', 'ec.employee_id')
		.where('cb.character_id', characterId);
};
//-----------------------------------------------------------------------------------------------//
export function findTenantAgreements({ characterId, 
									   trx = knex }) {
	return trx('rental_agreements as ra')
		.select({
			id: 'ra.id',
			residenceName: 'cb.name',
			dailyRent: 'ra.daily_rent',
			landlordFirstName: 'c.first_name',
			landlordLastName: 'c.last_name'
		})
		.innerJoin('character_buildings as cb', 'cb.id', 'ra.residence_id')
		.innerJoin('characters as c', 'c.id', 'cb.character_id')
		.where('ra.tenant_id', characterId);
};
//-----------------------------------------------------------------------------------------------//
export function findLandlordAgreements({ characterId, 
										 trx = knex }) {
	return trx('rental_agreements as ra')
		.select({
			id: 'ra.id',
			residenceName: 'cb.name',
			dailyRent: 'ra.daily_rent',
			tenantFirstName: 'c.first_name',
			tenantLastName: 'c.last_name'
		})
		.innerJoin('character_buildings as cb', 'cb.id', 'ra.residence_id')
		.innerJoin('characters as c', 'c.id', 'ra.tenant_id')
		.where('cb.character_id', characterId);
};
//-----------------------------------------------------------------------------------------------//
/*export function markTurnFinished(characterId, 
								 trx = knex) {
	await trx('characters')
		.where('id', characterId)
		.update({ has_finished_turn: true });
};*/