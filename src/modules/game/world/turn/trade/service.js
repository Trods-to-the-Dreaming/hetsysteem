import knex from '#utils/db.js';

//===============================================================================================//

export async function loadTrade({ characterId,
								  trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveTrade({ characterId,
								  trade,
								  trx = knex }) {
	if (!trade)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processTrade(trx) {
	
}