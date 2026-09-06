import knex from '#utils/db.js';
import { BadRequestError } from '#utils/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	GAME_ERROR,
	GameError 
} from '#modules/game/error.js';
//-----------------------------------------------------------------------------------------------//
import {
	/*listJobs,
	listRecreations,*/
	lockWorld,
	lockCharacter,
	findCharacter,
	countCharacters,
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

/*export async function prepareCreateCharacterOptions() {
	const jobs = await listJobs();
	const recreations = await listRecreations();
	
	return {
		jobs,
		recreations
	}
}*/
//-----------------------------------------------------------------------------------------------//
export async function loadCreateCharacter({ characterId,
											trx = knex }) {
	if (!characterId) {
		return {
			firstName: '',
			lastName: '',
			jobPreferences: [
				{ buildingId: '' },
				{ buildingId: '' },
				{ buildingId: '' }
			],
			recreationPreference: { productId: '' }
		}
	}
	
	const character = await findCharacter({ characterId });
	
	const action = await findCreateCharacterAction({ characterId });
	if (!action) {
		return {
			firstName: character.firstName,
			lastName: character.lastName,
			jobPreferences: [
				{ buildingId: '' },
				{ buildingId: '' },
				{ buildingId: '' }
			],
			recreationPreference: { productId: '' }
		};
	}

	return {
		firstName: character.firstName,
		lastName: character.lastName,
		jobPreferences: [
			{ buildingId: action.jobPreference1Id },
			{ buildingId: action.jobPreference2Id },
			{ buildingId: action.jobPreference3Id }
		],
		recreationPreference: { productId: action.recreationPreferenceId }
	};
}
//-----------------------------------------------------------------------------------------------//
export async function saveCreateCharacter({ characterId, 
											createCharacter }) {
	const {
		jobPreferences,
		recreationPreference
	} = createCharacter;

    try {
		await knex.transaction(async (trx) => {
			await upsertCreateCharacterAction({
				characterId,
				jobPreference1Id: jobPreferences[0].buildingId,
				jobPreference2Id: jobPreferences[1].buildingId,
				jobPreference3Id: jobPreferences[2].buildingId,
				recreationPreferenceId: recreationPreference.productId,
				trx
			});
		});
	} catch (err) {
		if (err.code === 'ER_NO_REFERENCED_ROW_2')
			throw new BadRequestError(MSG_INVALID_PREFERENCE);
		
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
//-----------------------------------------------------------------------------------------------//
export async function reserveCharacterName({ userId, 
											 worldId, 
											 firstName,
											 lastName }) {
	return knex.transaction(async (trx) => {
		const character = await lockCharacter({ 
			userId, 
			worldId,
			trx 
		});
		
		try {
			if (character) {
				await updateCharacter({ 
					characterId: character.id, 
					firstName, 
					lastName, 
					trx 
				});
				return {
					firstName,
					lastName
				};
			}
			
			const world = await lockWorld({
				worldId,
				trx
			});
			
			const { nCharacters } = await countCharacters({
				worldId,
				trx
			}); // count returns a string --> cast to integer
			
			if (Number(nCharacters) >= world.maxCharacters) 
				throw new GameError(GAME_ERROR.NO_NEW_CHARACTERS);
			
			await insertCharacter({
				userId,
				worldId,
				firstName,
				lastName,
				trx
			});
			
			return { 
				firstName,
				lastName 
			};
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY')
				throw new GameError(GAME_ERROR.CHARACTER_NAME_TAKEN);
			
			throw err;
		}
	});
}