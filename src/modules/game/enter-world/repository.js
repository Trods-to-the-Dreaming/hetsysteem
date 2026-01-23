import knex from '#utils/db.js';

//===============================================================================================//

export function listWorlds(trx = knex) {
	return trx('worlds')
		.select({
			id: 'id',
			type: 'type'
		})
		.orderBy('id');
}
//-----------------------------------------------------------------------------------------------//
export function findWorld({ worldId, 
							trx = knex }) {
	return trx('worlds')
		.select({
			id: 'id',
			slug: 'slug',
			type: 'type'
		})
		.where({ id: worldId })
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findCharacterName({ userId, 
									worldId, 
									trx = knex }) {
	return trx('character_names')
		.select({
			id: 'id',
			firstName: 'first_name',
			lastName: 'last_name'
		})
		.where({ 
			user_id: userId,
			world_id: worldId
		})
		.first();
};