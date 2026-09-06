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
export function listRecreations(trx = knex) {
	return trx('recreations as r')
		.select({
			id: 'r.product_id',
			type: 'p.type'
		})
		.innerJoin('products as p', 'r.product_id', 'p.id')
		.orderBy('id');
};
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
export function listJobs(trx = knex) {
	return trx('buildings')
		.select({
			id: 'id',
			type: 'job'
		})
		.orderBy('id');
}
//-----------------------------------------------------------------------------------------------//
export function lockTurn({ userId, 
						   worldId, 
						   trx = knex }) {
	return trx('turns')
		.select({ 
			editVersion: 'edit_version',
			saveVersion: 'save_version'
		})
		.where({ 
			user_id: userId,
			world_id: worldId
		})
		.forUpdate()
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findTurn({ userId, 
						   worldId, 
						   trx = knex }) {
	return trx('turns')
		.select({ 
			editVersion: 'edit_version',
			saveVersion: 'save_version'
		})
		.where({ 
			user_id: userId,
			world_id: worldId
		})
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function incrementTurnEditVersion({ userId, 
										   worldId, 
										   trx = knex }) {
	return trx('turns')
		.where({ 
			user_id: userId,
			world_id: worldId
		})
		.increment('edit_version', 1);
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
		.where({ 'character_id': characterId })
		.orderBy('product_id');
}
//-----------------------------------------------------------------------------------------------//
export function findOwnedBuildings({ characterId,
									 trx = knex }) {
	return trx('character_building_states as cbs')
		.select({
			characterBuildingId: 'cb.id',
			name: 'cb.name',
			buildingId: 'cbs.building_id',
			size: 'cbs.size'
		})
		.innerJoin('character_buildings as cb', 'cbs.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId })
		.orderBy('cbs.building_id');
}
//-----------------------------------------------------------------------------------------------//
export function findOwnedReservedBuildings({ characterId,
											 trx = knex }) {
	return trx('character_buildings as cb')
		.select({
			characterBuildingId: 'cb.id',
			name: 'cb.name'
		})
		.whereNotIn('cb.id', function() {
			this.select('character_building_id')
				.from('character_building_states');
		})
		.where({ 'cb.character_id': characterId })
		.orderBy('cb.name');
}
//-----------------------------------------------------------------------------------------------//
export function findOwnedConstructionSites({ characterId,
											 trx = knex }) {
	return trx('character_construction_sites as ccs')
		.select({
			characterBuildingId: 'ccs.character_building_id',
			buildingId: 'ccs.building_id',
			bricksUsed: 'ccs.bricks_used',
			bricksNeeded: 'ccs.bricks_needed'
		})
		.innerJoin('character_buildings as cb', 'ccs.character_building_id', 'cb.id')
		.where({ 'cb.character_id': characterId })
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
		.where({ 'ec.employee_id': characterId });
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
		.where({ 'cb.character_id': characterId })
}
//-----------------------------------------------------------------------------------------------//
export function findSelfEmploymentContracts({ characterId, 
											  trx = knex }) {
	return trx('self_employment_contracts as sec')
		.select({
			id: 'sec.id',
			buildingName: 'cb.name',
			workingHours: 'sec.working_hours'
		})
		.innerJoin('character_buildings as cb', 'sec.workplace_id', 'cb.id')
		.where({ 'cb.character_id': characterId })
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
		.where({ 'ra.tenant_id': characterId });
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
		.where({ 'cb.character_id': characterId })
}
//-----------------------------------------------------------------------------------------------//
export function updateCharacterState({ characterId,
									   trx = knex }) {
	return trx('character_states')
		.where({ 'character_id': characterId })
		.update({ has_finished_turn: true });
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
export function deleteUnusedCharacterBuilding({ characterBuildingId,
												characterId,
												trx = knex }) {
	return trx('character_buildings')
		.where({ 
			id: characterBuildingId,
			character_id: characterId
		})
		.whereNotIn('id', function () {
			this.select('character_building_id')
				.from('character_building_states');
		})
		.whereNotIn('id', function () {
			this.select('character_building_id')
				.from('construct_actions');
		})
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteUnusedCharacter({ userId,
										trx = knex }) {
	return trx('characters')
		.where({ user_id: userId })
		.whereNotIn('id', function () {
			this.select('character_id')
				.from('character_states');
		})
		.whereNotIn('id', function () {
			this.select('character_id')
				.from('create_character_actions');
		})
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteAllUnusedCharacterBuildings({ characterId,
													trx = knex }) {
	return trx('character_buildings')
		.where({ character_id: characterId })
		.whereNotIn('id', function () {
			this.select('character_building_id')
				.from('character_building_states');
		})
		.whereNotIn('id', function () {
			this.select('character_building_id')
				.from('construct_actions');
		})
		.del();
}
//-----------------------------------------------------------------------------------------------//
export function deleteUnusedCooperative({ characterId,
										  trx = knex }) {
	return trx('cooperatives')
		.where({ leader_id: characterId })
		.whereNotIn('id', function () {
			this.select('cooperative_id')
				.from('cooperative_members');
		})
		.whereNotIn('id', function () {
			this.select('cooperative_id')
				.from('found_actions');
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