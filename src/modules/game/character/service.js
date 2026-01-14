import { 
	BadRequestError 
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	YEARS_PER_TURN 
} from './../rules.js';
import {
	findCharacterState,
	findWorldState
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_CHARACTER = 'Dit personage bestaat niet.';
const MSG_INVALID_WORLD		= 'Deze wereld bestaat niet.';

//===============================================================================================//

export async function buildCharacterView({ characterId,
										   worldId }) {
	const characterState = await findCharacterState({ characterId });
	if (!characterState) throw new BadRequestError(MSG_INVALID_CHARACTER);
	
	const worldState = await findWorldState({ worldId });
	if (!worldState) throw new BadRequestError(MSG_INVALID_WORLD);
	
	return {
		...characterState,
		age: (worldState.currentTurn - characterState.birthTurn) * YEARS_PER_TURN;
	};
}