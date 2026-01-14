import { 
	listCustomizeActions,
	updateCharacter,
	deleteCustomizeAction
} from './repository.js';

//===============================================================================================//

export async function processCustomizeCharacter(trx) {
	const customizeActions = await listCustomizeActions(trx);

	for (const action of customizeActions) {
		await updateCharacter({
			...action,
			trx
		});

		await deleteCustomizeAction({ characterId: action.characterId, 
									  trx);
	}
}