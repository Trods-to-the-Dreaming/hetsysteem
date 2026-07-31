import { 
	canCreateCharacter,
	isCharacterCreated
} from '#game/service.js';

//===============================================================================================//

export async function prepareMenu({ userId, 
									worldId }) {
	const [
		hasCharacter, 
		mayCreateCharacter
	] = await Promise.all([
		isCharacterCreated({ userId, worldId }),
		canCreateCharacter({ userId, worldId })
	]);

	return {
		isCharacterCreated: hasCharacter,
		canCreateCharacter: mayCreateCharacter
	};
}