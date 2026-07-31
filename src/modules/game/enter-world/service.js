import { BadRequestError } from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import {
	listWorlds,
	findWorld
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_WORLD = 'Deze wereld bestaat niet.';

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
	if (!world) 
		throw new BadRequestError(MSG_INVALID_WORLD);

	return world;
}