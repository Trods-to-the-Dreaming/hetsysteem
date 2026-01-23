import knex from '#utils/db.js';

//===============================================================================================//

export function listJobs(trx = knex) {
	return trx('buildings')
		.select({
			id: 'id',
			type: 'job'
		});
}
//-----------------------------------------------------------------------------------------------//
export function listRecreations(trx = knex) {
	return trx('recreations as r')
		.select({
			id: 'r.product_id',
			type: 'p.type'
		})
		.innerJoin('products as p', 'r.product_id', 'p.id');
};