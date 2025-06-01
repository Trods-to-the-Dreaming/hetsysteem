import GAME_RULES from "../constants/game.rules.js";

export function convertHoursToYears(hours) {
	return Math.round((hours / GAME_RULES.HOURS_FULLTIME) * 10) / 10;
}

export function calculateLifeExpectancy(age, 
										cumulativeHealthLoss, 
										cumulativeHealthGain) {
	return Math.max(
		age + GAME_RULES.YEARS_PER_TURN - 1,
		GAME_RULES.MAX_AGE + cumulativeHealthGain * GAME_RULES.HEALTH_GAIN_FACTOR
						   - cumulativeHealthLoss * GAME_RULES.HEALTH_LOSS_FACTOR
	);
}