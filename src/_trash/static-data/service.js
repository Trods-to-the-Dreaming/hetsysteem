import { 
	getFromCache, 
	setInCache  
} from '#utils/cache.js';

import {
	listWorlds,
	listProducts,
	listRecreations,
	listBuildings
} from './repository.js';

//===============================================================================================//

async function getCachedList(cacheKey,
							 listFunction) {
	const cached = getFromCache(cacheKey);
	if (cached) return cached;
	
	const items = await listFunction();
	setInCache(cacheKey, items);
	
	return items;
}

//===============================================================================================//

export async function getWorlds() {	
	return getCachedList('worlds', listWorlds);
}
//-----------------------------------------------------------------------------------------------//
export async function getProducts() {
	return getCachedList('products', listProducts);
}
//-----------------------------------------------------------------------------------------------//
export async function getRecreations() {
	return getCachedList('recreations', listRecreations);
}
//-----------------------------------------------------------------------------------------------//
export async function getBuildings() {
	return getCachedList('buildings', listBuildings);
}