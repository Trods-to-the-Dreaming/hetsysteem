const cache = new Map();
//-----------------------------------------------------------------------------------------------//
export function getFromCache(key) {
	return cache.get(key) || null;
}
//-----------------------------------------------------------------------------------------------//
export function setInCache(key, value) {
	cache.set(key, value);
}
//-----------------------------------------------------------------------------------------------//
export function clearCache(key) {
	cache.delete(key);
}
//-----------------------------------------------------------------------------------------------//
export function clearAllCache() {
	cache.clear();
}