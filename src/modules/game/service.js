import { 
	findWorld,
	countCharacters,
	findCharacter,
	findCharacterState
} from './repository.js';

//===============================================================================================//

export async function canCreateCharacter({ userId, 
										   worldId }) {
	const world = await findWorld({ worldId });
	
	const { nCharacters } = await countCharacters({ worldId });
	
	const character = await findCharacter({
		userId,
		worldId
	});
	if (!character) {
		return Number(nCharacters) < world.maxCharacters;
	}
	
	const characterState = await findCharacterState({ characterId: character.id });
	
	return !characterState;
}
//-----------------------------------------------------------------------------------------------//
export async function isCharacterCreated({ userId, 
										   worldId }) {
	const character = await findCharacter({
		userId,
		worldId
	});
	if (!character) {
		return false;
	}
	
	const characterState = await findCharacterState({ characterId: character.id });
	
	return Boolean(characterState);
}