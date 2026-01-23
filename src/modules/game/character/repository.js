import knex from '#utils/db.js';

//===============================================================================================//

export function findCharacterState({ characterId,
									 trx = knex }) {
	return trx('characters as c')
		.select({
			isCustomized: 'c.is_customized',
			firstName: 'c.first_name',
			lastName: 'c.last_name',
			jobPreference1: 'b1.job',
			jobPreference2: 'b2.job',
			jobPreference3: 'b3.job',
			recreationPreference: 'p.type',
			birthTurn: 'c.birth_turn',
			health: 'c.health',
			lifeExpectancy: 'c.life_expectancy',
			happiness: 'c.happiness',
			education: 'c.education',
			balance: 'c.balance',
			ownedTiles: 'c.owned_tiles'
		})
		.leftJoin('buildings as b1', 'c.job_preference_1_id', 'b1.id')
		.leftJoin('buildings as b2', 'c.job_preference_2_id', 'b2.id')
		.leftJoin('buildings as b3', 'c.job_preference_3_id', 'b3.id')
		.leftJoin('recreations as r', 'c.recreation_preference_id', 'r.product_id')
		.leftJoin('products as p', 'r.product_id', 'p.id')
		.where({ 'c.id': characterId })
		.first();
};
//-----------------------------------------------------------------------------------------------//
export function findWorldState({ worldId,
								 trx = knex }) {
	return trx('world_state')
		.select({ currentTurn: 'current_turn' })
		.where({ world_id: worldId })
		.first();
};