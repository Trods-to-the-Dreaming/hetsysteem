import knex from '#utils/db.js';
import { 
	ok, 
	fail 
} from '#utils/result.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GameError 
} from '#modules/game/errors.js';
import { 
	GAME 
} from '#modules/game/reasons.js';
//-----------------------------------------------------------------------------------------------//
import {
	listJobs,
	listRecreations,
	findCharacter,
	lockCharacter,
	insertCharacter,
	updateCharacter,
	findActionCreateCharacter,
	upsertActionCreateCharacter,
	listActionsCreateCharacter,
	deleteActionCreateCharacter,
	insertCharacterState
} from './repository.js';

//===============================================================================================//

export async function getCreateCharacterOptions() {
	const jobs = await listJobs();
	const recreations = await listRecreations();
	
	return {
		jobs,
		recreations
	}
}
//-----------------------------------------------------------------------------------------------//
export async function getCreateCharacterFormState({ userId, 
													worldId }) {
	const emptyState = {
		firstName: '',
		lastName: '',
		jobPreferenceIds: ['', '', ''],
		recreationPreferenceId: ''
	};

	const character = await findCharacter({
		userId,
		worldId
	});
	if (!character) {
		return emptyState;
	}

	const action = await findActionCreateCharacter({
		characterId: character.id
	});
	if (!action) {
		return {
			...emptyState,
			firstName: character.firstName,
			lastName: character.lastName
		};
	}

	return {
		firstName: character.firstName,
		lastName: character.lastName,
		jobPreferenceIds: [
			action.jobPreference1Id,
			action.jobPreference2Id,
			action.jobPreference3Id
		],
		recreationPreferenceId: action.recreationPreferenceId
	};
}
//-----------------------------------------------------------------------------------------------//
export async function createCharacter({ userId, 
										worldId, 
										formState }) {
	const {
		firstName,
		lastName,
		jobPreferenceIds,
		recreationPreferenceId
	} = formState;

    try {
		return await knex.transaction(async (trx) => {
			const character = await lockCharacter({ 
				userId, 
				worldId,
				trx 
			});
			
			let characterId;
			try {
				if (!character) {
					[characterId] = await insertCharacter({ 
						userId, 
						worldId, 
						firstName, 
						lastName, 
						trx 
					});
				} else {
					characterId = character.id;
					await updateCharacter({ 
						characterId, 
						firstName, 
						lastName, 
						trx 
					});
				}
			} catch (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					throw new GameError({ 
						status: 409,
						code: GAME.REASON.CHARACTER_NAME_TAKEN
					});
				}
				
				throw err;
			}

			await upsertActionCreateCharacter({
				characterId,
				jobPreference1Id: jobPreferenceIds[0],
				jobPreference2Id: jobPreferenceIds[1],
				jobPreference3Id: jobPreferenceIds[2],
				recreationPreferenceId,
				trx
			});

			return ok();
		});
	} catch (err) {
		if (err instanceof GameError) {
            return fail({ 
				status: err.status,
				reason: err.code 
			});
		}
		
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function processCreateCharacter(trx) {
	const actions = await listActionsCreateCharacter(trx);
	for (const action of actions) {
		const {
			characterId,
			jobPreference1Id,
			jobPreference2Id,
			jobPreference3Id,
			recreationPreferenceId
		} = action;

		await insertCharacterState({
			characterId,
			jobPreference1Id,
			jobPreference2Id,
			jobPreference3Id,
			recreationPreferenceId,
			trx
		});

		await deleteActionCreateCharacter({
			characterId,
			trx
		});
	}
}