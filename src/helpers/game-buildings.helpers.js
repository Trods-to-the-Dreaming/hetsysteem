//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	getFromCache, 
	setInCache  
} from "../utils/cache.js";

//=== Main ======================================================================================//

//--- Get building ids --------------------------------------------------------------------------//
export async function getBuildingIds(connection = db) {
	const cacheKey = "building-ids";
	const cached = getFromCache(cacheKey);
	
	if (cached) return cached;

	const [rows] = await connection.execute(
		`SELECT id, 
				slug 
		 FROM buildings`
	);
	const buildingMap = Object.fromEntries(rows.map(p => [p.slug, p.id]));
	setInCache(cacheKey, buildingMap);
	
	return buildingMap;
}