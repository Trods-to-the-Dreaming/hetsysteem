import { 
	BadRequestError 
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import {
	listWorlds,
	findWorld,
	findCharacter,
	findCharacterState
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_WORLD = 'Deze wereld bestaat niet.';

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
	if (!world)
		throw new BadRequestError(MSG_INVALID_WORLD);

	world.class = 'world-' + world.slug;

	const character = await findCharacter({ 
		userId,
		worldId
	});
	if (!character) {
		return {
			world,
			character: null
		};
	}

	const characterState = await findCharacterState({ 
		characterId: character.id
	});
	if (!characterState) {
		return {
			world,
			character: null
		};
	}

	return {
		world,
		character
	};
}