//=== Imports ===================================================================================//

import knex from '#utils/db.js';
import { 
	getFromCache, 
	setInCache  
} from '#utils/cache.js';
import { BadRequestError } from '#utils/errors.js';

//=== Main ======================================================================================//

export async function getWorlds(trx = knex) {
	const cached = getFromCache('worlds');
	
	if (cached) return cached;
	
	const rows = await trx('worlds')
		.select(
			'id',
			'slug',
			'type',
			'money_system as moneySystem',
			'n_characters as nCharacters',
			'n_tiles as nTiles',
			'created_at as createdAt'
		);
	
	setInCache('worlds', rows);
	return rows;
}
//-----------------------------------------------------------------------------------------------//
export async function getProducts(trx = knex) {
	const cached = getFromCache('products');
	
	if (cached) return cached;
	
	const rows = await trx('products')
		.select(
			'id',
			'slug',
			'type',
			'volume'
		);
	
	setInCache('products', rows);
	return rows;
}
//-----------------------------------------------------------------------------------------------//
export async function getRecreations(trx = knex) {
	const cached = getFromCache('recreations');
	
	if (cached) return cached;

	const rows = await trx('recreations as r')
		.select(
			'r.product_id as id',
			'p.slug as slug',
			'p.type as type'
		)
		.innerJoin('products as p', 'r.product_id', 'p.id');
	
	setInCache('recreations', rows);
	return rows;
}
//-----------------------------------------------------------------------------------------------//
export async function getBuildings(trx = knex) {
	const cached = getFromCache('buildings');
	
	if (cached) return cached;
	
	const rows = await trx('buildings')
		.select(
			'id', 
			'slug', 
			'type', 
			'is_constructible as isConstructible',
			'base_size as baseSize',
			'job',
			'input_id as inputId',
			'output_id as outputId',
			'booster_id as boosterId',
			'worn_booster_id as wornBoosterId',
			'input_per_output as inputPerOutput',
			'boosted_working_hours_per_booster as boostedWorkingHoursPerBooster',
			'max_working_hours as maxWorkingHours',
			'base_factor as baseFactor',
			'boost_factor as boostFactor'
		);
	
	setInCache('buildings', rows);
	return rows;
}