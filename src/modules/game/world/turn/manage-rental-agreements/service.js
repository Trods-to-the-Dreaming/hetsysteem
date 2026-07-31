import knex from '#utils/db.js';

//===============================================================================================//

export async function loadManageRentalAgreements({ characterId,
												   trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveManageRentalAgreements({ characterId,
												   manageRentalAgreements,
												   trx = knex }) {
	if (!manageRentalAgreements)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processManageRentalAgreements(trx) {
	
}