export function ok(value = null) {
	return { ok: true, 
			 value };
}
//-----------------------------------------------------------------------------------------------//
export function fail({ status,
					   reason,
					   meta = null }) {
	return { ok: false, 
			 status,
			 reason, 
			 meta };
}