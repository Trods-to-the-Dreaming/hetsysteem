import { 
	GameError 
} from '#modules/game/errors.js';
import { 
	GAME
} from '#modules/game/reasons.js';
//-----------------------------------------------------------------------------------------------//
import {
	listWorlds,
	findWorld,
	findCharacterState
} from './repository.js';

//===============================================================================================//

export async function getEnterWorldOptions() {
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

	const characterState = await findCharacterState({ 
		userId,
		worldId
	});

	return {
		world: {
			id: world.id,
			name: world.name,
			class: `world-${world.slug}`
		},
		isCharacterCreated: Boolean(characterState)
	};
}