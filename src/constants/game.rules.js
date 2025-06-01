const GAME_RULES = Object.freeze({
	FOOD: {
		NEEDED: 3,
		MAX: 4
	},
	MEDICAL_CARE: {
		NEEDED: 1,
		MAX: 2
	},
	HOURS_FULLTIME: 8,
	YEARS_PER_TURN: 3,
	MAX_AGE: 90,
	HEALTH_GAIN_FACTOR: 0.1,
	HEALTH_LOSS_FACTOR: 1,
	EDUCATION_LABELS: {
		1: "Primair (1)",
		2: "Primair (2)",
		3: "Secundair (3)",
		4: "Secundair (4)",
		5: "Bachelor (5)",
		6: "Master (6)"
	}
});

export default GAME_RULES;