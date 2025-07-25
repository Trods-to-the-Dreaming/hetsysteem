//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	getFromCache, 
	setInCache  
} from "../utils/cache.js";
import { BadRequestError } from "../utils/errors.js";

//=== Main ======================================================================================//

//--- Get all worlds ----------------------------------------------------------------------------//
export async function getAllWorlds(connection = db) {
	const key = "worlds";
	const cached = getFromCache(key);
	
	if (cached) return cached;
	
	const [rows] = await connection.execute(
		`SELECT id, 
				slug, 
				name, 
				money_system,
				n_characters,
				n_tiles,
				created_at
		 FROM worlds`
	);
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//--- Get all products --------------------------------------------------------------------------//
export async function getAllProducts(connection = db) {
	const key = "products";
	const cached = getFromCache(key);
	
	if (cached) return cached;
	
	const [rows] = await connection.execute(
		`SELECT id, 
				slug, 
				name, 
				volume
		 FROM products`
	);
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//--- Get all buildings -------------------------------------------------------------------------//
export async function getAllBuildings(connection = db) {
	const key = "buildings";
	const cached = getFromCache(key);
	
	if (cached) return cached;
	
	const [rows] = await connection.execute(
		`SELECT id, 
				slug, 
				name, 
				tile_size,
				job_id
		 FROM buildings`
	);
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//--- Get all jobs ------------------------------------------------------------------------------//
export async function getAllJobs(connection = db) {
	const key = "jobs";
	const cached = getFromCache(key);
	
	if (cached) return cached;
	
	const [rows] = await connection.execute(
		`SELECT id, 
				slug, 
				name, 
				input_id,
				output_id,
				booster_id,
				worn_booster_id,
				input_per_output,
				boosted_working_hours_per_booster,
				max_working_hours,
				base_factor,
				boost_factor
		 FROM jobs`
	);
	
	const cache = buildEntityCache(rows);
	setInCache(key, cache);
	return cache;
}

//--- Get all recreations -----------------------------------------------------------------------//
export async function getAllRecreations(connection = db) {
	const key = "recreations";
	const cached = getFromCache(key);
	
	if (cached) return cached;
	
	const [rows] = await connection.execute(
		`SELECT r.id AS id, 
				p.slug AS slug, 
				p.name AS name
		 FROM recreations r
		 INNER JOIN products p ON r.product_id = p.id`
	);
	
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
		const slug = row["slug"];
		const name = row["name"];

		idSet.add(id);
		slugToId[slug] = id;
		idToFull[id] = row;
		options.push({ id, name });
	}

	return {
		has: (id) => idSet.has(id),
		getId: (slug) => slugToId[slug],
		get: (id) => idToFull[id],
		options,
		all: rows
	};
}
