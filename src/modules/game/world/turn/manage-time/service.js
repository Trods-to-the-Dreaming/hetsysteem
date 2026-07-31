import knex from '#utils/db.js';

//===============================================================================================//

export async function loadManageTime({ characterId,
									   trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveManageTime({ characterId,
									   manageTime,
									   trx = knex }) {
	if (!manageTime)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processManageTime(trx) {
	
}