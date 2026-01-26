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
export function findCharacter({ userId, 
								worldId, 
								trx = knex }) {
	return trx('characters')
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
//-----------------------------------------------------------------------------------------------//
export function findCharacterState({ characterId,
									 trx = knex }) {
	return trx('character_states')
		.select(1)
		.where({ character_id: characterId })
		.first();
};