//=== Imports ===================================================================================//
import knex from '../utils/db.js';
import { 
	BadRequestError 
} from '../utils/errors.js';

import { 
	MSG_INVALID_CHARACTER,
	MSG_INVALID_WORLD
} from '../constants/game.messages.js';
import { 
	YEARS_PER_TURN,
	HOURS_FULLTIME,
	EDUCATION_LEVEL
} from '../constants/game.rules.js';

//=== Main ======================================================================================//

//--- Build character view ----------------------------------------------------------------------//
export const buildCharacterView = async (characterId,
										 worldId,
										 trx = knex) => {
	const character = await trx('characters as c')
		.select(
			'c.first_name as firstName',
			'c.last_name as lastName',
			'j1.type as jobPreference1',
			'j2.type as jobPreference2',
			'j3.type as jobPreference3',
			'p.type as recreationPreference',
			'c.birth_date as birthDate',
			'c.health',
			'c.life_expectancy as lifeExpectancy',
			'c.happiness',
			'c.education',
			'c.balance',
			'c.owned_tiles as ownedTiles'
		)
		.innerJoin('jobs as j1', 'c.job_preference_1_id', 'j1.id')
		.innerJoin('jobs as j2', 'c.job_preference_2_id', 'j2.id')
		.innerJoin('jobs as j3', 'c.job_preference_3_id', 'j3.id')
		.innerJoin('recreations as r', 'c.recreation_preference_id', 'r.id')
		.innerJoin('products as p', 'r.product_id', 'p.id')
		.where('c.id', characterId)
		.first();
	if (!character) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	const world = await trx('world_state')
		.select('current_turn as currentTurn')
		.where('world_id', worldId)
		.first();
	if (!world) {
		throw new BadRequestError(MSG_INVALID_WORLD);
	}
	
	// Calculate age
	character.age = (world.currentTurn - character.birthDate) * YEARS_PER_TURN;
	
	// Calculate education level
	const educationIndex = Math.floor(character.education); // TO DO: change formula
	character.education_level = EDUCATION_LEVEL[educationIndex];
	delete character.education;
	
	// Job experience
	const jobExperience = await trx('character_experience as ce')
		.select(
			'j.type as job',
			'ce.experience AS experienceHours')
		.innerJoin('jobs as j', 'ce.job_id', 'j.id')
		.where('ce.character_id', characterId);
	character.experience = jobExperience.map((row) => ({
		job: row.job,
		experienceYears: convertHoursToYears(row.experienceHours),
	}));

	return character;
};

//=== Extra =====================================================================================//

//--- Convert hours to years --------------------------------------------------------------------//
function convertHoursToYears(hours) {
	return Math.round((hours / HOURS_FULLTIME) * 10) / 10; // TO DO: change formula
}

/*//--- Calculate life expectancy -------------------------------------------------------
function calculateLifeExpectancy(age, 
								 gain,
								 loss) {
	return Math.max(
		age + GAME_RULES.YEARS_PER_TURN - 1,
		GAME_RULES.MAX_AGE + gain * GAME_RULES.HEALTH_GAIN_FACTOR
						   - loss * GAME_RULES.HEALTH_LOSS_FACTOR
	);
}*/