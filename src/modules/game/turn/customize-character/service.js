import knex from '#utils/db.js';
//-----------------------------------------------------------------------------------------------//
import { 
	listCustomizeActions,
	updateCharacter,
	deleteCustomizeAction
} from './repository.js';

//===============================================================================================//

const MSG_INVALID_CHARACTER	 = 'Dit personage bestaat niet.';
const MSG_ALREADY_CUSTOMIZED = 'Dit personage is al aangepast.';
const MSG_MUST_BE_CUSTOMIZED = 'Dit personage moet worden aangepast.';

//===============================================================================================//

export async function loadCustomizeCharacter({ characterId,
											   trx = knex }) {
	
	NOG NAKIJKEN --> FAIL/OK GEBRUIKEN?
	
	const row = await findCustomizeAction({
		characterId,
		trx
	});

	// Geen customize-fase gedaan
	if (!row) {
		return undefined;
	}

	const {
		firstName,
		lastName,
		jobPreference1,
		jobPreference2,
		jobPreference3,
		recreationPreference
	} = row;

	return {
		firstName,
		lastName,
		jobPreferences: [
			jobPreference1,
			jobPreference2,
			jobPreference3
		],
		recreationPreference
	};
}
//-----------------------------------------------------------------------------------------------//
export async function saveCustomizeCharacter({ characterId,
											   phase,
											   trx = knex }) {
	const character = await findCharacter({
		characterId,
		trx
	});
	
	if (!character) 
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	
	if (character.isCustomized && phase)
		throw new BadRequestError(MSG_ALREADY_CUSTOMIZED);
	
	if (!character.isCustomized && !phase)
		throw new BadRequestError(MSG_MUST_BE_CUSTOMIZED);
	
	if (character.isCustomized && !phase)
		return;
	
	const { firstName,
			lastName,
			jobPreferences,
			recreationPreference } = phase;
	
	const jobs = await findJobs({
		jobPreferences, 
		trx
	});
	if (jobs.length !== jobPreferences.length)
		throw new BadRequestError(MSG_INVALID_JOB_PREFERENCE);

	const recreation = await findRecreation({
		recreationPreference,
		trx
	});
	if (!recreation)
		throw new BadRequestError(MSG_INVALID_RECREATION_PREFERENCE);
	
	const [ jobPreference1,
			jobPreference2,
			jobPreference3 ] = jobPreferences;
	
	await upsertCustomizeAction({
		characterId,
		firstName,
		lastName,
		jobPreference1,
		jobPreference2,
		jobPreference3,
		recreationPreference,
		trx
	});
}
//-----------------------------------------------------------------------------------------------//
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