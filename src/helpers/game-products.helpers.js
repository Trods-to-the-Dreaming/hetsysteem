//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	getFromCache, 
	setInCache  
} from "../utils/cache.js";

//=== Main ======================================================================================//

//--- Get product ids ---------------------------------------------------------------------------//
export async function getProductIds(connection = db) {
	const cacheKey = "product-ids";
	const cached = getFromCache(cacheKey);
	
	if (cached) return cached;

	const [rows] = await connection.execute(
		`SELECT id, 
				slug 
		 FROM products`
	);
	const productMap = Object.fromEntries(rows.map(p => [p.slug, p.id]));
	setInCache(cacheKey, productMap);
	
	return productMap;
}