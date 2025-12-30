export function ok(value = null) {
	return { ok: true, value };
}
//-----------------------------------------------------------------------------------------------//
export function fail(reason, 
					 meta = null) {
	return { ok: false, reason, meta };
}