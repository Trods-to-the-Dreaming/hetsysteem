import knex from '#utils/db.js';
import { 
	BadRequestError
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GameError 
} from '#modules/game/errors.js';
import { 
	GAME 
} from '#modules/game/reasons.js';

import { 
	
} from './repository.js';

//===============================================================================================//



//===============================================================================================//

export async function loadTrade({ characterId,
								  trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveTrade({ characterId,
								  phase,
								  trx = knex }) {
	if (!phase)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processTrade(trx) {
	
}