import knex from '#utils/db.js';

//===============================================================================================//

export function findWorld({ worldId,
							trx = knex }) {
	return trx('worlds')
		.select({ maxCharacters: 'max_characters' })
		.where({ id: worldId })
		.first();
}
//-----------------------------------------------------------------------------------------------//
export function countCharacters({ worldId,
								  trx = knex }) {
	return trx('characters')
		.where({ world_id: worldId })
		.count({ nCharacters: '*' })
		.first();
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
}
//-----------------------------------------------------------------------------------------------//
export function findCharacterState({ characterId, 
									 trx = knex }) {
	return trx('character_states')
		.select(1)
		.where({ character_id: characterId })
		.first();
};