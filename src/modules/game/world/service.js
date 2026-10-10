import { 
	canCreateCharacter,
	isCharacterCreated
} from '#modules/game/service.js';

//===============================================================================================//

export async function prepareMenu({ userId, 
									worldId }) {
	const [ 
		canCreateCharacterResult,
		isCharacterCreatedResult
	] = await Promise.all([
		canCreateCharacter({ userId, worldId }),
		isCharacterCreated({ userId, worldId })
	]);

	return {
		canCreateCharacter: canCreateCharacterResult,
		isCharacterCreated: isCharacterCreatedResult
	};
}