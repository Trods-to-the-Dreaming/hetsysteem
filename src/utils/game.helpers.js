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

export async function replaceOrders(db, characterId, type, category, orders) {
	const validTypes = ["buy", "sell"];
	if (!validTypes.includes(type)) {
		throw new BadRequestError(`Ongeldig order type: ${type}`);
	}
	
	const validCategories = ["product", "building"];
	if (!validCategories.includes(category)) {
		throw new BadRequestError(`Ongeldige categorie: ${category}`);
	}

	await db.execute(
		`DELETE FROM ${category}_${type}_orders WHERE character_id = ?`,
		[characterId]
	);

	if (orders.length === 0) return;

	const valuePlaceholders = orders.map(() => "(?, ?, ?, ?)").join(", ");
	const valueParams = orders.flatMap(order => [
		characterId,
		order.itemId,
		order.quantity,
		order.unitPrice,
	]);

	await db.execute(
		`INSERT INTO ${category}_${type}_orders
		 (character_id, ${category}_id, quantity, ${type === "buy" ? "max" : "min"}_unit_price)
		 VALUES ${valuePlaceholders}`,
		valueParams
	);
}
/*
export function addFrontendIds(orders) {
	return orders.map((order, index) => ({
		...order,
		orderId: index + 1
	}));
}*/