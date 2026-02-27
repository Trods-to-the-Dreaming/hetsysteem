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

export async function loadConsume({ characterId,
									trx = knex }) {
	
}
//-----------------------------------------------------------------------------------------------//
export async function saveConsume({ characterId,
									phase,
									trx = knex }) {
	if (!phase)
		return;
	
	
}
//-----------------------------------------------------------------------------------------------//
export async function processConsume(trx) {
	
}