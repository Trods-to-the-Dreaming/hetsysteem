import knex from '#utils/db.js';

//===============================================================================================//

export function listWorlds(trx = knex) {
	return trx('worlds')
		.select({
			id: 'id',
			name: 'name'
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
			name: 'name'
		})
		.where({ id: worldId })
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findCharacterState({ userId, 
									 worldId, 
									 trx = knex }) {
	return trx('characters as c')
		.select(1)
		.innerJoin('character_states as cs', 'cs.character_id', 'c.id')
		.where({ 
			'c.user_id': userId,
			'c.world_id': worldId
		})
		.first();
};