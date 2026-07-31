import knex from '#utils/db.js';

//===============================================================================================//

export async function loadManageEmploymentContracts({ characterId,
													  trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveManageEmploymentContracts({ characterId,
													  manageEmploymentContracts,
													  trx = knex }) {
	if (!manageEmploymentContracts)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processManageEmploymentContracts(trx) {
	
}