import knex from '#utils/db.js';

//===============================================================================================//

export const url = {
	key: 'trade',
	url: '/game/world/turn/trade'
}
//-----------------------------------------------------------------------------------------------//
export async function loadActions({ characterId,
									trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveActions({ characterId,
									actions,
									trx = knex }) {
	if (!actions)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processActions(trx) {
	
}