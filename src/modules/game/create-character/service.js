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
	findCharacterName,
	lockCharacterName,
	insertCharacterName,
	updateCharacterName,
	findCreateCharacterAction,
	insertCreateCharacterAction
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

	const characterName = await findCharacterName({
		userId,
		worldId
	});
	if (!characterName) {
		return emptyState;
	}

	const action = await findCreateCharacterAction({
		characterNameId: characterName.id
	});
	if (!action) {
		return {
			...emptyState,
			firstName: characterName.firstName,
			lastName: characterName.lastName
		};
	}

	return {
		firstName: characterName.firstName,
		lastName: characterName.lastName,
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
			const characterName = await lockCharacterName({ 
				userId, 
				worldId,
				trx 
			});
			
			let characterNameId;
			try {
				if (!characterName) {
					[characterNameId] = await insertCharacterName({ 
						userId, 
						worldId, 
						firstName, 
						lastName, 
						trx 
					});
				} else {
					characterNameId = characterName.id;
					await updateCharacterName({ 
						id: characterNameId, 
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

			await insertCreateCharacterAction({
				characterNameId,
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