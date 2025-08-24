//=== Imports ===================================================================================//
import db from '../utils/db.js';
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
										 connection = db) => {
	const [[character]] = await connection.execute(
		`SELECT c.first_name,
				c.last_name,
				j1.name AS job_preference_1,
				j2.name AS job_preference_2,
				j3.name AS job_preference_3,
				p.name AS recreation_preference,
				c.birth_date,
				c.health,
				c.life_expectancy,
				c.happiness,
				c.education,
				c.balance,
				c.owned_tiles
		 FROM characters c
		 INNER JOIN jobs j1 ON c.job_preference_1_id = j1.id
		 INNER JOIN jobs j2 ON c.job_preference_2_id = j2.id
		 INNER JOIN jobs j3 ON c.job_preference_3_id = j3.id
		 INNER JOIN recreations r ON c.recreation_preference_id = r.id
		 INNER JOIN products p ON r.product_id = p.id
		 WHERE c.id = ?`,
		[characterId]
	);
	if (!character) {
		throw new BadRequestError(MSG_INVALID_CHARACTER);
	}
	
	const [[world]] = await connection.execute(
		`SELECT current_turn 
		 FROM world_state
		 WHERE world_id = ?`,
		[worldId]
	);
	if (!world) {
		throw new BadRequestError(MSG_INVALID_WORLD);
	}
	
	// Calculate age
	character.age = (world.current_turn - character.birth_date) * YEARS_PER_TURN;
	
	// Calculate education level
	const educationIndex = Math.floor(character.education); // TO DO: change formula
	character.education_level = EDUCATION_LEVEL[educationIndex];
	delete character.education;
	
	// Job experience
	const [jobExperience] = await connection.execute(
		`SELECT j.type AS job,
				ce.experience AS experience_hours
		 FROM character_experience ce
		 INNER JOIN jobs j ON ce.job_id = j.id
		 WHERE ce.character_id = ?`,
		[characterId]
	);	
	character.experience = jobExperience.map((row) => ({
		job: row.job,
		experience_years: convertHoursToYears(row.experience_hours),
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