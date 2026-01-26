import knex from '#utils/db.js';

//===============================================================================================//

export function findCharacterState({ characterId,
									 trx = knex }) {
	return trx('character_states as cs')
		.select({
			firstName: 'c.first_name',
			lastName: 'c.last_name',
			jobPreference1: 'b1.job',
			jobPreference2: 'b2.job',
			jobPreference3: 'b3.job',
			recreationPreference: 'p.type',
			birthTurn: 'cs.birth_turn',
			health: 'cs.health',
			lifeExpectancy: 'cs.life_expectancy',
			happiness: 'cs.happiness',
			education: 'cs.education',
			balance: 'cs.balance',
			ownedTiles: 'cs.owned_tiles'
		})
		.innerJoin('characters as c', 'cs.character_id', 'c.id')
		.innerJoin('buildings as b1', 'cs.job_preference_1_id', 'b1.id')
		.innerJoin('buildings as b2', 'cs.job_preference_2_id', 'b2.id')
		.innerJoin('buildings as b3', 'cs.job_preference_3_id', 'b3.id')
		.innerJoin('recreations as r', 'cs.recreation_preference_id', 'r.product_id')
		.innerJoin('products as p', 'r.product_id', 'p.id')
		.where({ 'cs.character_id': characterId })
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findWorld({ worldId,
							trx = knex }) {
	return trx('worlds')
		.select({ currentTurn: 'current_turn' })
		.where({ id: worldId })
		.first();
};