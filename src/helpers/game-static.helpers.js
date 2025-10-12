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
	
	const cache = buildEntityCache(rows);
	setInCache('worlds', cache);
	return cache;
}

//--- Get all products --------------------------------------------------------------------------//
export async function getAllProducts(trx = knex) {
	const cached = getFromCache('products');
	
	if (cached) return cached;
	
	const rows = await trx('products')
		.select(
			'id',
			'slug',
			'type',
			'volume'
		);
	
	const cache = buildEntityCache(rows);
	setInCache('products', cache);
	return cache;
}

//--- Get all recreations -----------------------------------------------------------------------//
export async function getAllRecreations(trx = knex) {
	const cached = getFromCache('recreations');
	
	if (cached) return cached;

	const rows = await trx('recreations as r')
		.select(
			'r.product_id as id',
			'p.slug as slug',
			'p.type as type'
		)
		.innerJoin('products as p', 'r.product_id', 'p.id');
	
	const cache = buildEntityCache(rows);
	setInCache('recreations', cache);
	return cache;
}

//--- Get all buildings -------------------------------------------------------------------------//
export async function getAllBuildings(trx = knex) {
	const cached = getFromCache('buildings');
	
	if (cached) return cached;
	
	const rows = await trx('buildings')
		.select(
			'id', 
			'slug', 
			'type', 
			'tile_size as tileSize',
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

//--- Get all jobs ------------------------------------------------------------------------------//
export async function getAllJobs(trx = knex) {
	const cached = getFromCache('jobs');
	
	if (cached) return cached;
	
	const allBuildings = await getAllBuildings(trx);

	const rows = allBuildings.all.map(b => ({
		id: b.id,
		slug: b.slug,
		type: b.job
	}));

	const cache = buildEntityCache(rows);
	setInCache('jobs', cache);
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