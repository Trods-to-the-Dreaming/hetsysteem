import knex from '#utils/db.js';

//===============================================================================================//

export async function loadShare({ characterId,
								  trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveShare({ characterId,
								  share,
								  trx = knex }) {
	if (!share)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processShare(trx) {
	
}