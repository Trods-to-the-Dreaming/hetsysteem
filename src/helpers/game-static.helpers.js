//=== Imports ===================================================================================//
import knex from '../utils/db.js';
import { 
	getFromCache, 
	setInCache  
} from '../utils/cache.js';
import { BadRequestError } from '../utils/errors.js';

//=== Main ======================================================================================//

//--- Get all worlds ----------------------------------------------------------------------------//
export async function getAllWorlds(trx = knex) {
	const key = 'worlds';
	const cached = getFromCache(key);
	
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
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//--- Get all products --------------------------------------------------------------------------//
export async function getAllProducts(trx = knex) {
	const key = 'products';
	const cached = getFromCache(key);
	
	if (cached) return cached;
	
	const rows = await trx('products')
		.select(
			'id',
			'slug',
			'type',
			'volume'
		);
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//--- Get all buildings -------------------------------------------------------------------------//
export async function getAllBuildings(trx = knex) {
	const key = 'buildings';
	const cached = getFromCache(key);
	
	if (cached) return cached;

	const rows = await trx('buildings')
		.select(
			'id',
			'slug',
			'type',
			'tile_size as tileSize',
			'job_id as jobId'
		);
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//--- Get all jobs ------------------------------------------------------------------------------//
export async function getAllJobs(trx = knex) {
	const key = 'jobs';
	const cached = getFromCache(key);
	
	if (cached) return cached;
	
	const rows = await trx('jobs')
		.select(
			'id', 
			'slug', 
			'type', 
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
	setInCache(key, cache);
	return cache;
}

//--- Get all recreations -----------------------------------------------------------------------//
export async function getAllRecreations(trx = knex) {
	const key = 'recreations';
	const cached = getFromCache(key);
	
	if (cached) return cached;

	const rows = await trx('recreations as r')
		.select(
			'r.id as id',
			'p.slug as slug',
			'p.type as type'
		)
		.innerJoin('products as p', 'r.product_id', 'p.id');
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//=== Extra =====================================================================================//

//--- Build entity cache ------------------------------------------------------------------------//
function buildEntityCache(rows) {
	const idSet = new Set();
	const slugToId = {};
	const idToFull = {};
	const options = [];

	for (const row of rows) {
		const id = row.id;
		const slug = row['slug'];
		const type = row['type'];

		idSet.add(id);
		slugToId[slug] = id;
		idToFull[id] = row;
		options.push({ id, type });
	}

	return {
		has: (id) => idSet.has(id),
		getId: (slug) => slugToId[slug],
		get: (id) => idToFull[id],
		options,
		all: rows
	};
}