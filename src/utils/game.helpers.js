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
		throw new BadRequestError(`Ongeldige order categorie: ${category}`);
	}

	await db.execute(
		`DELETE FROM ${category}_${type}_orders
		 WHERE character_id = ?`,
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
		 (character_id, 
		  ${category}_id, 
		  ${type === "buy" ? "demand" : "supply"}, 
		  ${type === "buy" ? "max" : "min"}_unit_price)
		 VALUES ${valuePlaceholders}`,
		valueParams
	);
}

/*export const getAffordableBuyOrders = async (category, id) => {
	const validCategories = ["product", "building"];
	if (!validCategories.includes(category)) {
		throw new BadRequestError(`Ongeldige order categorie: ${category}`);
	}

	const table = `${category}_buy_orders`;
	const itemId = `${category}_id`;

	const [orders] = await db.execute(
	`SELECT cbo.character_id,
		    cbo.${itemId} AS item_id,
		    cbo.quantity,
		    cbo.max_unit_price,
		    c.balance
	 FROM ${table} cbo
	 JOIN characters c ON cbo.character_id = c.id
	 WHERE cbo.${itemId} = ? AND 
		   (cbo.quantity * cbo.max_unit_price) <= c.balance`,
	[id]);

	return orders;
};

export const getSellOrders = async (category, id) => {
	const validCategories = ["product", "building"];
	if (!validCategories.includes(category)) {
		throw new BadRequestError(`Ongeldige order categorie: ${category}`);
	}

	const table = `${category}_sell_orders`;
	const itemId = `${category}_id`;

	const [orders] = await db.execute(
	`SELECT cso.character_id,
		    cso.${itemId} AS item_id,
		    cso.quantity,
		    cso.min_unit_price
	 FROM ${table} cso
	 WHERE cso.${itemId} = ?`,
	[id]);

	return orders;
};


export const matchOrders = async (category, id) => {
	const validCategories = ["product", "building"];
	if (!validCategories.includes(category)) {
		throw new BadRequestError(`Ongeldige order categorie: ${category}`);
	}

	const buyTable = `${category}_buy_orders`;
	const sellTable = `${category}_sell_orders`;
	const itemId = `${category}_id`;

	const [buyOrders] = await db.execute(
	`SELECT cbo.character_id,
		    cbo.${itemId} AS item_id,
		    cbo.quantity,
		    cbo.max_unit_price,
		    c.balance
	 FROM ${table} cbo
	 JOIN characters c ON cbo.character_id = c.id
	 WHERE cbo.${itemId} = ? AND 
		   (cbo.quantity * cbo.max_unit_price) <= c.balance`,
	[id]);
	
	const [sellOrders] = await db.execute(
	`SELECT cso.character_id,
		    cso.${itemId} AS item_id,
		    cso.quantity,
		    cso.min_unit_price
	 FROM ${table} cso
	 WHERE cso.${itemId} = ?`,
	[id]);

	

	return orders;
};



function isCompleteMatch(sellOrders, buyOrders) {
	//////////////////////////////////////////////////////
	// sellOrders: sorted by ascending unit price order //
	// buyOrders: sorted by descending unit price order //
	//////////////////////////////////////////////////////
	
	// Start with highest sell order
	for (let s = sellOrders.length - 1; s >= 0; s--) {
	
		// Start with highest buy order
		for (let b = 0; b < buyOrders.length; b++) {
		}
	}
	
	return { match: true };
	
	return { match: false,
			 reason: };
}*/
