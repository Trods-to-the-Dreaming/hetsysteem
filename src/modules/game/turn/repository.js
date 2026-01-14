import knex from '#utils/db.js';

//===============================================================================================//

export function findCharacter({ worldId, 
								lowerCaseFirstName, 
								lowerCaseLastName,
								trx = knex }) {
	return trx('characters')
		.select(1)
		.where('world_id', worldId)
		.andWhereRaw('LOWER(first_name) = ?', lowerCaseFirstName)
		.andWhereRaw('LOWER(last_name) = ?', lowerCaseLastName)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findOtherCustomizeAction({ selfId,
										   worldId, 
										   lowerCaseFirstName, 
										   lowerCaseLastName,
										   trx = knex }) {
	return trx('action_customize as ac')
		.select(1)
		.innerJoin('characters as c', 'ac.character_id', 'c.id')
		.where('c.id', '!=', selfId)
		.andWhere('c.world_id', worldId)
		.andWhereRaw('LOWER(ac.first_name) = ?', lowerCaseFirstName)
		.andWhereRaw('LOWER(ac.last_name) = ?', lowerCaseLastName)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findBuilding({ worldId, 
							   lowerCaseBuildingName
							   trx = knex }) {
	return trx('character_buildings')
		.select(1)
		.where('world_id', worldId)
		.andWhereRaw('LOWER(name) = ?', lowerCaseBuildingName)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function findOtherConstructAction({ selfId,
										   worldId, 
										   lowerCaseBuildingName
										   trx = knex }) {
	return trx('action_construct as ac')
		.select(1)
		.innerJoin('characters as c', 'ac.character_id', 'c.id')
		.where('c.id', '!=', selfId)
		.andWhere('c.world_id', worldId)
		.andWhereRaw('LOWER(ac.name) = ?', lowerCaseBuildingName)
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function startProcessActions(trx = knex) {
	return trx('cron_process_actions').insert({
		status: 'running'
	});
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