import {
	findCharacterState
} from './repository.js';

//===============================================================================================//

export async function isCharacterCreated({ userId, 
										   worldId }) {
	const character = await findCharacterState({
		userId,
		worldId
	});
	
	return Boolean(character);
}