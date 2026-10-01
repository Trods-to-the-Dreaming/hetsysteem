import knex from '#utils/db.js';

//===============================================================================================//

export function lockCooperative({ userId,
								  worldId,
								  trx = knex }) {
	return trx('cooperatives')
		.select({ id: 'id' })
		.where({
			user_id: userId,
			world_id: worldId
		})
		.forUpdate()
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function insertCooperative({ userId,
								    worldId,
								    cooperativeName,
								    trx = knex }) {
	return trx('cooperatives').insert({
			user_id: userId,
			world_id: worldId,
			cooperative_name: cooperativeName
		});
}
//-----------------------------------------------------------------------------------------------//
export function updateCooperative({ cooperativeId,
								    cooperativeName,
								    trx = knex }) {
	return trx('cooperatives')
		.where({ id: cooperativeId })
		.update({ cooperative_name: cooperativeName });
}