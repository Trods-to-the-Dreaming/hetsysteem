import { 
	findWorld,
	countCharacters,
	findCharacter,
	hasCharacterState
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
	
	return !Boolean(
		await hasCharacterState({ characterId: character.id })
	);
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
	
	return Boolean(
		await hasCharacterState({ characterId: character.id })
	);
}