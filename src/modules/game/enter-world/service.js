import { 
	BadRequestError 
} from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import {
	listWorlds,
	findWorld,
	findCharacterName
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

	const worldData = {
		id: world.id,
		class: 'world-' + world.slug,
		type: world.type
	};

	const characterData = await findCharacterName({ 
		userId,
		worldId
	});

	return {
		world: worldData,
		character: characterData
	};
}