import knex from '#utils/db.js';
import { 
	BadRequestError
} from '#utils/errors.js';
import { 
	ConflictError
} from '#modules/game/errors.js';
//-----------------------------------------------------------------------------------------------//
import { 
	findCharacter,
	findJobs,
	findRecreation,
	listCreateCharacterActions,
	findCreateCharacterAction,
	deleteCreateCharacterAction,
	upsertCreateCharacterAction,
	updateCharacter
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_CHARACTER	 = 'Dit personage bestaat niet.';
const MSG_ALREADY_CUSTOMIZED = 'Dit personage is al aangepast.';
const MSG_MUST_BE_CUSTOMIZED = 'Dit personage moet worden aangepast.';
const MSG_INVALID_JOB		 = 'Deze job bestaat niet.';
const MSG_INVALID_RECREATION = 'Deze recreatie bestaat niet.';

//===============================================================================================//

/*export async function loadCreateCharacter({ characterNameId,
											trx = knex }) {
	const action = await findCreateCharacterAction({
		characterNameId,
		trx
	});
	if (!action) {
		return undefined;
	}

	const {
		characterNameId,
		jobPreference1Id,
		jobPreference2Id,
		jobPreference3Id,
		recreationPreferenceId
	} = action;

	return {
		characterNameId,
		jobPreferenceIds: [
			jobPreference1Id,
			jobPreference2Id,
			jobPreference3Id
		],
		recreationPreferenceId
	};
}
//-----------------------------------------------------------------------------------------------//
export async function saveCreateCharacter({ characterNameId,
											phase,
											trx = knex }) {
	// Check character
	const character = await findCharacter({
		characterNameId,
		trx
	});
	if (!character) 
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	
	// Check phase
	if (phase && character.isCustomized)
		throw new BadRequestError(MSG_ALREADY_CUSTOMIZED);
	
	if (!phase && !character.isCustomized)
		throw new BadRequestError(MSG_MUST_BE_CUSTOMIZED);
	
	if (!phase && character.isCustomized)
		return ok();
	
	const { 
		firstName,
		lastName,
		jobPreferenceIds,
		recreationPreferenceId 
	} = phase;
	
	// Check preferences
	const validJobs = await findJobs({
		jobPreferenceIds, 
		trx
	});
	if (validJobs.length !== jobPreferenceIds.length)
		throw new BadRequestError(MSG_INVALID_JOB);
	
	const validRecreation = await findRecreation({
		recreationPreferenceId,
		trx
	});
	if (!validRecreation)
		throw new BadRequestError(MSG_INVALID_RECREATION);
	
	const [ 
		jobPreference1Id,
		jobPreference2Id,
		jobPreference3Id 
	] = jobPreferenceIds;
	
	// Save action
	await deleteCreateCharacterAction({
		characterId,
		trx
	});
	
	try {
		await insertCreateCharacterAction({
			characterId,
			firstName,
			lastName,
			jobPreference1Id,
			jobPreference2Id,
			jobPreference3Id,
			recreationPreferenceId,
			trx
		});
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') {
			throw new ConflictError({
				code: GAME.REASON.CHARACTER_NAME_TAKEN, 
				meta: {	firstName, lastName }
			});
			
		}
		
		throw err;
	}
	
	return ok();
}*/
//-----------------------------------------------------------------------------------------------//
export async function processCreateCharacter(trx) {
	const actions = await listActionsCreateCharacter(trx);
	for (const action of actions) {
		const {
			characterId,
			firstName,
			lastName,
			jobPreference1Id,
			jobPreference2Id,
			jobPreference3Id,
			recreationPreferenceId
		} = action;

		await updateCharacter({
			characterId,
			firstName,
			lastName,
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