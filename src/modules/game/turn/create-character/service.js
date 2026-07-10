import knex from '#utils/db.js';
import { 
	ok, 
	fail 
} from '#utils/result.js';
import { 
	BadRequestError
} from '#utils/errors.js';
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
	findCreateCharacterAction,
	upsertCreateCharacterAction,
	listCreateCharacterActions,
	deleteCreateCharacterAction,
	insertCharacterState
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_PREFERENCE = 'Ongeldige job- of recreatievoorkeur.'

//===============================================================================================//

export async function prepareCreateCharacterOptions() {
	const jobs = await listJobs();
	const recreations = await listRecreations();
	
	return {
		jobs,
		recreations
	}
}
//-----------------------------------------------------------------------------------------------//
export async function loadCreateCharacter({ userId, 
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

	const action = await findCreateCharacterAction({
		characterId: character.id
	});

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
export async function saveCreateCharacter({ userId, 
											worldId, 
											createCharacter }) {
	const {
		firstName,
		lastName,
		jobPreferenceIds,
		recreationPreferenceId
	} = createCharacter;

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

			await upsertCreateCharacterAction({
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
		} else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
			throw new BadRequestError(MSG_INVALID_PREFERENCE);
		}
		
		throw err;
	}
}
//-----------------------------------------------------------------------------------------------//
export async function processCreateCharacter(trx) {
	const actions = await listCreateCharacterActions(trx);
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

		await deleteCreateCharacterAction({
			characterId,
			trx
		});
	}
}