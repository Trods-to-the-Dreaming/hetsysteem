//=== Imports ===================================================================================//
import knex from '#utils/db.js';
import { 
	BadRequestError 
} from '#utils/errors.js';

import { 
	MSG_INVALID_CHARACTER,
	MSG_INVALID_WORLD
} from '#constants/game.messages.js';
import { 
	YEARS_PER_TURN,
	HOURS_FULLTIME,
	EDUCATION_LEVEL
} from '#constants/game.rules.js';

//=== Main ======================================================================================//

//--- Build character view ----------------------------------------------------------------------//
export const buildCharacterView = async (characterId,
										 worldId,
										 trx = knex) => {
	const character = await trx('characters as c')
		.select(
			'c.is_customized as isCustomized',
			'c.first_name as firstName',
			'c.last_name as lastName',
			'b1.job as jobPreference1',
			'b2.job as jobPreference2',
			'b3.job as jobPreference3',
			'p.type as recreationPreference',
			'c.birth_date as birthDate',
			'c.health',
			'c.life_expectancy as lifeExpectancy',
			'c.happiness',
			'c.education',
			'c.balance',
			'c.owned_tiles as ownedTiles'
		)
		.leftJoin('buildings as b1', 'c.job_preference_1_id', 'b1.id')
		.leftJoin('buildings as b2', 'c.job_preference_2_id', 'b2.id')
		.leftJoin('buildings as b3', 'c.job_preference_3_id', 'b3.id')
		.leftJoin('recreations as r', 'c.recreation_preference_id', 'r.product_id')
		.leftJoin('products as p', 'r.product_id', 'p.id')
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
			'b.job as job',
			'ce.experience AS experienceHours')
		.innerJoin('buildings as b', 'ce.job_id', 'b.id')
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