import { 
	YEARS_PER_TURN 
} from './../rules.js';
//-----------------------------------------------------------------------------------------------//
import {
	findCharacterName,
	findCharacter,
	findWorldState
} from './repository.js';

//===============================================================================================//

export async function buildCharacterView({ characterId,
										   worldId }) {
	const characterState = await findCharacterState({ characterId });
	const world = await findWorld({ worldId });
	
	return {
		...characterState,
		age: (world.currentTurn - characterState.birthTurn) * YEARS_PER_TURN;
	};
}