//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	getFromCache, 
	setInCache  
} from "../utils/cache.js";
import { BadRequestError } from "../utils/errors.js";

//=== Constants =================================================================================//
const MSG_INVALID_ENTITY = "Ongeldige entiteit.";

//=== Main ======================================================================================//

//--- Get valid ids -----------------------------------------------------------------------------//
export async function getValidIds(entity, 
								  connection = db) {
	const allowedEntities = new Set(["products", 
									 "buildings", 
									 "jobs", 
									 "recreations"]);
	if (!allowedEntities.has(entity)) {
		throw new BadRequestError(MSG_INVALID_ENTITY);
	}

	const cached = getFromCache(entity);
	
	if (cached) return cached;

	const [rows] = await connection.execute(
		`SELECT id, 
				slug 
		 FROM \`${entity}\``
	);

	const ids = new Set(rows.map(row => row.id));
	const slugToId = Object.fromEntries(rows.map(row => [row.slug, row.id]));

	const validIds = {
		...slugToId,             // bv: cache["slug"] -> id
		has: (id) => ids.has(id) // bv: cache.has(id) -> true/false
	};

	setInCache(entity, validIds);

	return validIds;
}