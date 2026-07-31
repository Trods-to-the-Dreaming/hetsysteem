import knex from '#utils/db.js';

//===============================================================================================//

export async function loadConsume({ characterId,
									trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveConsume({ characterId,
									consume,
									trx = knex }) {
	if (!consume)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processConsume(trx) {
	
}