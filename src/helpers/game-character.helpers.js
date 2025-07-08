//=== Imports ===================================================================================//
import db from "../utils/db.js";
import { 
	NotFoundError 
} from "../utils/errors.js";

import GAME_RULES from "../constants/game.rules.js";

//=== Constants =================================================================================//
const MSG_INVALID_CHARACTER	   = "Het gevraagde personage bestaat niet.";

//=== Main ======================================================================================//

//--- Convert hours to years --------------------------------------------------------------------//
export function convertHoursToYears(hours) {
	return Math.round((hours / GAME_RULES.HOURS_FULLTIME) * 10) / 10;
}

//--- Calculate life expectancy -------------------------------------------------------
export function calculateLifeExpectancy(age, 
										gain,
										loss) {
	return Math.max(
		age + GAME_RULES.YEARS_PER_TURN - 1,
		GAME_RULES.MAX_AGE + gain * GAME_RULES.HEALTH_GAIN_FACTOR
						   - loss * GAME_RULES.HEALTH_LOSS_FACTOR
	);
}

//--- Get character -----------------------------------------------------------------------------//
export const getCharacter = async (id, 
								   connection = db) => {
	const [characters] = await db.execute(
		`SELECT c.*,
				j1.name AS job_preference_1,
				j2.name AS job_preference_2,
				j3.name AS job_preference_3,
				p.name AS recreation_preference
		 FROM characters c
		 INNER JOIN jobs j1 ON c.job_preference_1_id = j1.id
		 INNER JOIN jobs j2 ON c.job_preference_2_id = j2.id
		 INNER JOIN jobs j3 ON c.job_preference_3_id = j3.id
		 INNER JOIN recreations r ON c.recreation_preference_id = r.id
		 INNER JOIN products p ON r.product_id = p.id
		 WHERE c.id = ?`,
		[id]
	);
	if (characters.length === 0) {
		throw new NotFoundError(MSG_INVALID_CHARACTER);
	}
	const character = characters[0];
	
	// Life expectancy
	character.life_expectancy = calculateLifeExpectancy(
		character.age,
		character.cumulative_health_loss,
		character.cumulative_health_gain
	);
	
	// Education
	if (character.education > 0) {
		character.education_label = GAME_RULES.EDUCATION_LABELS[character.education];
	}
	
	// Job experience
	const [jobExperience] = await db.execute(
		`SELECT j.name AS job_name,
				e.experience AS experience_hours
		 FROM character_job_experience e
		 INNER JOIN jobs j ON e.job_id = j.id
		 WHERE e.character_id = ?`,
		[character.id]
	);
	character.job_experience = jobExperience.map((row) => ({
		job_name: row.job_name,
		experience_years: convertHoursToYears(row.experience_hours),
	}));

	return character;
};