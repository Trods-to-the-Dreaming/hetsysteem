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
			//'slug',
			'type',
			'money_system as moneySystem',
			'n_characters as nCharacters',
			'n_tiles as nTiles',
			'created_at as createdAt'
		);
	
	const cache = buildEntityCache(rows);
	setInCache('worlds', cache);
	return cache;
}
//-----------------------------------------------------------------------------------------------//
export async function getProducts(trx = knex) {
	const cached = getFromCache('products');
	
	if (cached) return cached;
	
	const rows = await trx('products')
		.select(
			'id',
			//'slug',
			'type',
			'volume'
		);
	
	const cache = buildEntityCache(rows);
	setInCache('products', cache);
	return cache;
}
//-----------------------------------------------------------------------------------------------//
export async function getRecreations(trx = knex) {
	const cached = getFromCache('recreations');
	
	if (cached) return cached;

	const rows = await trx('recreations as r')
		.select(
			'r.product_id as id',
			//'p.slug as slug',
			'p.type as type'
		)
		.innerJoin('products as p', 'r.product_id', 'p.id');
	
	const cache = buildEntityCache(rows);
	setInCache('recreations', cache);
	return cache;
}
//-----------------------------------------------------------------------------------------------//
export async function getBuildings(trx = knex) {
	const cached = getFromCache('buildings');
	
	if (cached) return cached;
	
	const rows = await trx('buildings')
		.select(
			'id', 
			//'slug', 
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
	
	const cache = buildEntityCache(rows);
	setInCache('buildings', cache);
	return cache;
}

//=== Extra =====================================================================================//

function buildEntityCache(rows) {
	const idSet = new Set();
	//const slugToId = {};
	const idToFull = {};
	//const options = [];

	for (const row of rows) {
		const id = row.id;
		//const slug = row['slug'];
		//const type = row['type'];

		idSet.add(id);
		//slugToId[slug] = id;
		idToFull[id] = row;
		//options.push({ id, type });
	}

	return {
		has: (id) => idSet.has(id),
		//getId: (slug) => slugToId[slug],
		get: (id) => idToFull[id],
		//options,
		all: rows
	};
}