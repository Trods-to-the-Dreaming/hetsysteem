import knex from '#utils/db.js';

//===============================================================================================//

export async function loadProduce({ characterId,
									trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveProduce({ characterId,
									produce,
									trx = knex }) {
	if (!produce)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processProduce(trx) {
	
}