import { 
	GameError 
} from '#modules/game/errors.js';
import { 
	GAME
} from '#modules/game/reasons.js';
//-----------------------------------------------------------------------------------------------//
import {
	listWorlds,
	findWorld
} from './repository.js';

//===============================================================================================//

export async function prepareEnterWorldOptions() {
	const worlds = await listWorlds();
	
	return { worlds };
}
//-----------------------------------------------------------------------------------------------//
export async function enterWorld({ userId,
								   formState }) {
	const { worldId } = formState;
	
	const world = await findWorld({ worldId });
	if (!world) {
		throw new GameError({ 
			status: 404,
			code: GAME.REASON.INVALID_WORLD
		});
	}

	return world;
}