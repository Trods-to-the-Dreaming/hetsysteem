import knex from '#utils/db.js';

//===============================================================================================//

export function listWorlds(trx = knex) {
	return trx('worlds')
		.select({
			id: 'id',
			slug: 'slug',
			type: 'type',
			moneySystem: 'money_system',
			nCharacters: 'n_characters',
			nTiles: 'n_tiles',
			createdAt: 'created_at'
		});
}
//-----------------------------------------------------------------------------------------------//
export function listProducts(trx = knex) {
	return trx('products')
		.select({
			id: 'id',
			slug: 'slug',
			type: 'type',
			volume: 'volume'
		});
}
//-----------------------------------------------------------------------------------------------//
export function listRecreations(trx = knex) {
	return trx('recreations as r')
		.select({
			id: 'r.product_id',
			slug: 'p.slug',
			type: 'p.type'
		})
		.innerJoin('products as p', 'r.product_id', 'p.id');
}
//-----------------------------------------------------------------------------------------------//
export function listBuildings(trx = knex) {
	return trx('buildings')
		.select({
			id: 'id', 
			slug: 'slug', 
			type: 'type', 
			isConstructible: 'is_constructible',
			baseSize: 'base_size',
			job: 'job',
			inputId: 'input_id',
			outputId: 'output_id',
			boosterId: 'booster_id',
			wornBoosterId: 'worn_booster_id',
			inputPerOutput: 'input_per_output',
			boostedWorkingHoursPerBooster: 'boosted_working_hours_per_booster',
			maxWorkingHours: 'max_working_hours',
			baseFactor: 'base_factor',
			boostFactor: 'boost_factor'
		});
}