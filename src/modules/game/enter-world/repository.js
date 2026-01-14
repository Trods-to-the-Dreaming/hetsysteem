import knex from '#utils/db.js';

//===============================================================================================//

export function findCharacter({ worldId, 
								userId, 
								trx = knex }) {
	return trx('characters')
		.select({
			id: 'id',
			firstName: 'first_name',
			lastName: 'last_name'
		})
		.where('world_id', worldId)
		.andWhere('user_id', userId)
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findFreeCharacter({ worldId, 
									trx = knex }) {
	return trx('characters')
		.select({
			id: 'id'
		})
		.where('world_id', worldId)
		.andWhere('user_id', null)
		.forUpdate()
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function claimCharacter({ characterId,
								 userId,
								 trx = knex }) {
	return trx('characters')
		.where('id', characterId)
		.andWhere('user_id', null)
		.update({
			user_id: userId,
			is_customized: false
		});
};