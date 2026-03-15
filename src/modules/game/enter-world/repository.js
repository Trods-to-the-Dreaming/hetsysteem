import knex from '#utils/db.js';

//===============================================================================================//

export function listWorlds(trx = knex) {
	return trx('worlds')
		.select({
			id: 'id',
			slug: 'slug',
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