import knex from '#utils/db.js';

//===============================================================================================//

export function listProducts(trx = knex) {
	return trx('products')
		.select({
			id: 'id',
			type: 'type'
		})
		.orderBy('id');
}
//-----------------------------------------------------------------------------------------------//
export function listBuildings(trx = knex) {
	return trx('buildings')
		.select({
			id: 'id',
			slug: 'slug',
			type: 'type',
			isConstructible: 'is_constructible'
		})
		.orderBy('id');
}
//-----------------------------------------------------------------------------------------------//
export function findCharacter({ userId, 
								worldId, 
								trx = knex }) {
	return trx('characters')
		.select({ id: 'id' })
		.where({ 
			user_id: userId,
			world_id: worldId
		})
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findCharacterState({ characterId,
									 trx = knex }) {
	return trx('character_states')
		.select({
			hasFinishedTurn: 'has_finished_turn',
			hoursAvailable: 'hours_available',
			ownedTiles: 'owned_tiles'
		})
		.where({ 'character_id': characterId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findOwnedProducts({ characterId,
									trx = knex }) {
	return trx('character_products')
		.select({
			productId: 'product_id',
			quantity: 'quantity'
		})
		.where('character_id', characterId)
		.orderBy('product_id');
}
//-----------------------------------------------------------------------------------------------//
export function findOwnedBuildings({ characterId,
									 trx = knex }) {
	return trx('character_building_states as cbs')
		.select({
			id: 'cb.id',
			name: 'cb.name',
			buildingId: 'cbs.building_id',
			size: 'cbs.size'
		})
		.innerJoin('character_buildings as cb', 'cbs.character_building_id', 'cb.id')
		.where('cb.character_id', characterId)
		.orderBy('cbs.building_id');
}
//-----------------------------------------------------------------------------------------------//
export function findOwnedReservedBuildings({ characterId,
											 trx = knex }) {
	return trx('character_buildings as cb')
		.select({
			id: 'cb.id',
			name: 'cb.name'
		})
		.whereNotIn('cb.id', function() {
			this.select('character_building_id')
				.from('character_building_states');
		})
		.where('cb.character_id', characterId)
		.orderBy('cb.name');
}
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
		.innerJoin('character_buildings as cb', 'ccs.character_building_id', 'cb.id')
		.where('cb.character_id', characterId)
		.orderBy('ccs.building_id');
}
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
		.innerJoin('character_buildings as cb', 'ec.workplace_id', 'cb.id')
		.innerJoin('characters as c', 'cb.character_id', 'c.id')
		.where('ec.employee_id', characterId);
}
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
		.innerJoin('character_buildings as cb', 'ec.workplace_id', 'cb.id')
		.innerJoin('characters as c', 'ec.employee_id', 'c.id')
		.where('cb.character_id', characterId);
}
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
		.innerJoin('character_buildings as cb', 'ra.residence_id', 'cb.id')
		.innerJoin('characters as c', 'cb.character_id', 'c.id')
		.where('ra.tenant_id', characterId);
}
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
		.innerJoin('character_buildings as cb', 'ra.residence_id', 'cb.id')
		.innerJoin('characters as c', 'ra.tenant_id', 'c.id')
		.where('cb.character_id', characterId);
}
//-----------------------------------------------------------------------------------------------//
export function insertCharacterBuilding({ characterId, 
										  worldId, 
										  characterBuildingName, 
										  trx = knex }) {
	return trx('character_buildings')
		.insert({ 
			character_id: characterId, 
			world_id: worldId, 
			name: characterBuildingName
		});
}
//-----------------------------------------------------------------------------------------------//
export function deleteCharacterBuilding({ characterBuildingId,
										  characterId,
										  trx = knex }) {
	return trx('character_buildings')
		.where({ 
			id: characterBuildingId, 
			character_id: characterId
		})
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function startProcessActions(trx = knex) {
	return trx('cron_process_actions')
		.insert({ status: 'running' });
}
//-----------------------------------------------------------------------------------------------//
export async function finishProcessActions({ runId, 
											 status, 
											 errorMessage = null, 
											 trx = knex }) {
	await trx('cron_process_actions')
		.where({ id: runId })
		.update({
			status,
			error_message: errorMessage,
			finished_at: knex.fn.now()
		});
}