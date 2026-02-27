import { 
	YEARS_PER_TURN 
} from '#modules/game/rules.js';
//-----------------------------------------------------------------------------------------------//
import {
	findCharacterState,
	findWorld
} from './repository.js';

//===============================================================================================//

export async function buildCharacterView({ userId,
										   worldId }) {
	const [
		characterState, 
		world
	] = await Promise.all([
		findCharacterState({ userId, worldId }),
		findWorld({ worldId })
	]);
	
	return {
		...characterState,
		age: (world.currentTurn - characterState.birthTurn) * YEARS_PER_TURN
	};
}