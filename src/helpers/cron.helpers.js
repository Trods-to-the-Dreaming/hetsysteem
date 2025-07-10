//=== Imports ===================================================================================//
import db from "../utils/db.js";

//=== Constants =================================================================================//
const MSG_INVALID_CATEGORY = "De gevraagde ordercategorie bestaat niet.";

//=== Main ======================================================================================//

//--- Process category orders -------------------------------------------------------------------//
export const processCategoryOrders = async (category) => {
	const validCategories = ["product", "building"];
	if (!validCategories.includes(category)) {
		throw new BadRequestError(MSG_INVALID_CATEGORY);
	}
	
	// Delete yesterday's transactions
	await db.execute(
		`TRUNCATE ${category}_transactions`
	);
	
	// Get the id's for the items of this category
	const [rows] = await db.execute(
		`SELECT id 
		 FROM ${category}s`
	);
	const ids = rows.map(row => row.id);
	
	// Get the stock for the items of this category
	const [stockRows] = await db.execute(
		`SELECT * 
		 FROM character_${category}s`
	);
	const stockMap = new Map();
	for (const row of stockRows) {
		const key = `${row.character_id}-${row[`${category}_id`]}`;
		stockMap.set(key, row.quantity);
	}
	
	// Process the items of this category
	for (const id of ids) {
		const buyers = await getBuyers(category, id);
		const sellers = await getSellers(category, id, stockMap);
		const tradingVolume = await calculateTradingVolume(buyers, sellers);
		
		await processCategoryItemOrder(category, id, buyers, sellers, tradingVolume);
	}
	
	// Delete today's buy orders
	await db.execute(
		`TRUNCATE ${category}_buy_orders`
	);
	
	// Delete today's sell orders
	await db.execute(
		`TRUNCATE ${category}_sell_orders`
	);
	
	// Reset orders confirmation
	await db.execute(
		`UPDATE characters 
		 SET has_confirmed_orders = FALSE`
	);
};

//=== Extra =====================================================================================//

//--- Get buyers --------------------------------------------------------------------------------//
const getBuyers = async (category,
						 id) => {
	// Get buyers in ascending unit price order
	let [buyers] = await db.execute(
	  `SELECT bo.character_id,
			  bo.demand,
			  bo.max_unit_price,
			  c.balance
	   FROM ${category}_buy_orders AS bo
	   INNER JOIN characters AS c ON bo.character_id = c.id
	   WHERE bo.${category}_id = ?
	   ORDER BY bo.max_unit_price ASC`,
	  [id]
	);
	
	// Reduce the demand of buyers with insufficient money
	for (let b = 0; b < buyers.length; b++) {
		const buyer = buyers[b];
		const affordableDemand = Math.floor(buyer.balance / buyer.max_unit_price);
		buyer.demand = Math.min(buyer.demand, affordableDemand);
	}
	
	// Remove buyers with no demand
	buyers = buyers.filter(b => b.demand > 0);
	
	return buyers;
};

//--- Get sellers -------------------------------------------------------------------------------//
const getSellers = async (category,
						  id,
						  stockMap) => {
	// Get sellers in ascending unit price order
	let [sellers] = await db.execute(
		`SELECT character_id, 
				supply, 
				min_unit_price 
		 FROM ${category}_sell_orders 
		 WHERE ${category}_id = ?
		 ORDER BY min_unit_price ASC`,
		[id]
	);
	
	// Reduce the supply of sellers with insufficient stock
	for (let s = 0; s < sellers.length; s++) {
		const seller = sellers[s];
		const key = `${seller.character_id}-${id}`;
		const stock = stockMap.get(key) || 0;
		seller.supply = Math.min(seller.supply, stock);
	}
	
	// Remove sellers with no supply
	sellers = sellers.filter(s => s.supply > 0);
	
	return sellers;
};

//--- Calculate trading volume ------------------------------------------------------------------//
const calculateTradingVolume = async (buyers,
									  sellers) => {
	// In a chart with quantity on the horizontal axis and
	// unit price on the vertical axis, buyers and sellers 
	// represent the demand curve and the supply curve.
	// Both curves look like ascending stairs. Each buyer 
	// or seller is a step of the stairs. The width of the 
	// step is given by the demanded or supplied quantity. 
	// The height of the step is given by the unit price.
	
	// We want to maximize the trading volume. That is
	// accomplished by sliding the demand curve over the 
	// supply curve until they collide.
	
	// When the demand curve and the supply curve collide 
	// the overlap would be the same as if the demand 
	// curve had only two steps. The first step has the 
	// unit price of the demand curve at the point of 
	// contact for the demand before the point of contact, 
	// while the second step has infinite unit price for 
	// the demand after the point of contact.
	
	// Therefore, the trading volume can be determined
	// by considering a two-step-curve for each jump in
	// the demand curve. The minimum of all the overlaps 
	// is the trading volume.
	
	// Determine the trading volume
	let tradingVolume = Number.POSITIVE_INFINITY;
	let higherDemand = 0;
	for (let b = buyers.length - 1; b >=0 ; b--) {
		const buyer = buyers[b];
		
		// Calculate the supply up to the buyer's unit price
		let lowerSupply = 0;
		for (let s = 0; s < sellers.length; s++) {
			const seller = sellers[s];
			if (seller.min_unit_price <= buyer.max_unit_price) {
				lowerSupply += seller.supply;
			} else {
				break;
			}
		}
		
		// Calculate the new trading volume
		const newTradingVolume = higherDemand + lowerSupply;
		if (newTradingVolume < tradingVolume) {
			tradingVolume = newTradingVolume;
		}
		
		// Calculate the demand higher than the buyer's unit price
		higherDemand += buyer.demand;
	}
	// There is always demand at zero unit price
	if (higherDemand < tradingVolume) {
		tradingVolume = higherDemand;
	}
	
	return tradingVolume;
};
	
//--- Process category item order ---------------------------------------------------------------//
const processCategoryItemOrder = async (category,
										id,
										buyers,
										sellers,
										tradingVolume) => {
	if (Number.isFinite(tradingVolume)) {
		// Remove excess supply
		let sumSupply = 0;
		let sLast = 0;
		while (sumSupply < tradingVolume &&
			   sLast < sellers.length) {
			sumSupply += sellers[sLast].supply;
			sLast++;
		}
		sLast--;
		if (sLast >= 0) {
			sellers[sLast].supply -= sumSupply - tradingVolume;
		}
		sellers.splice(sLast + 1);
		
		// Remove excess demand
		let sumDemand = 0;
		let bFirst = buyers.length - 1;
		while (sumDemand < tradingVolume &&
			   bFirst >= 0) {
			sumDemand += buyers[bFirst].demand;
			bFirst--;
		}
		bFirst++;
		if (bFirst < buyers.length) {
			buyers[bFirst].demand -= sumDemand - tradingVolume;
		}
		buyers.splice(0, bFirst);
		
		// Create transactions
		const connection = await db.getConnection();
		try {
			let s = 0;
			let b = 0;
			while (tradingVolume > 0) {
				const buyer = buyers[b];
				const seller = sellers[s];

				const quantity = Math.min(buyer.demand, seller.supply);
				const unitPrice = (seller.min_unit_price + buyer.max_unit_price) / 2;
				const price = Math.round(quantity * unitPrice);

				try {
					await connection.beginTransaction();
					
					// Insert transaction
					await connection.execute(
						`INSERT INTO ${category}_transactions 
							(buyer_id, 
							 seller_id, 
							 ${category}_id, 
							 quantity, 
							 price)
						 VALUES (?, ?, ?, ?, ?)`,
						[buyer.character_id, 
						 seller.character_id, 
						 id, 
						 quantity, 
						 price]
					);

					// Update buyer and seller balance
					await connection.execute(
						`UPDATE characters 
						 SET balance = balance - ? 
						 WHERE id = ?`,
						[price, 
						 buyer.character_id]
					);
					await connection.execute(
						`UPDATE characters 
						 SET balance = balance + ? 
						 WHERE id = ?`,
						[price, 
						 seller.character_id]
					);

					// Update buyer and seller inventory
					await connection.execute(
						`INSERT INTO character_${category}s 
							(character_id, 
							 ${category}_id, 
							 quantity)
						 VALUES (?, ?, ?)
						 ON DUPLICATE KEY 
						 UPDATE quantity = quantity + VALUES(quantity)`,
						[buyer.character_id, 
						 id, 
						 quantity]
					);
					await connection.execute(
						`UPDATE character_${category}s
						 SET quantity = quantity - ?
						 WHERE character_id = ? AND 
							   ${category}_id = ? AND 
							   quantity >= ?`,
						[quantity, 
						 seller.character_id,
						 id,
						 quantity]
					);
					
					// Remove the seller's row, if quantity = 0
					await connection.execute(
						`DELETE FROM character_${category}s
						 WHERE character_id = ? AND 
							   ${category}_id = ? AND 
							   quantity = 0`,
						[seller.character_id, 
						 id]
					);
					
					await connection.commit();
				} catch (err) {
					await connection.rollback();
					throw err;
				}
				
				buyer.demand -= quantity;
				seller.supply -= quantity;
				tradingVolume -= quantity;

				if (buyer.demand === 0) b++;
				if (seller.supply === 0) s++;
			} 
		} finally {
			connection.release();
		}
	} 
};





//--- Update health -----------------------------------------------------------------------------//
export const updateHealth = async (characterId,
								   foodConsumed, 
								   medicalCareConsumed, 
								   connection = db) => {
	const [character] = await connection.execute(
		`SELECT health,
				cumulative_health_loss,
				cumulative_health_gain
		 FROM characters
		 WHERE id = ?`,
		[characterId]
	);
	if (character.length === 0) {
		throw new NotFoundError(MSG_INVALID_CHARACTER);
	}
	
	let { health,
		  cumulative_health_loss,
		  cumulative_health_gain } = character[0];
	
	const deltaFood = foodConsumed - GAME_RULES.FOOD.NEEDED;
	const deltaMedicalCare = medicalCareConsumed - GAME_RULES.MEDICAL_CARE.NEEDED;
	
	if (deltaFood < 0) {
		const loss = deltaFood * deltaFood;
		health -= loss;
		cumulative_health_loss += loss;
	} else if (deltaFood > 0) {
		health += deltaFood;
		cumulative_health_gain += deltaFood;
	}
	
	if (deltaMedicalCare < 0) {
		const loss = deltaMedicalCare * deltaMedicalCare;
		health -= loss;
		cumulative_health_loss += loss;
	} else if (deltaMedicalCare > 0) {
		health += deltaMedicalCare;
		cumulative_health_gain += deltaMedicalCare;
	}
	
	health = Math.min(Math.max(health, 0), 100);
	
	await connection.execute(
		`UPDATE characters
		 SET health = ?,
			 cumulative_health_loss = ?,
			 cumulative_health_gain = ?
		 WHERE id = ?`,
		[health,
		 cumulative_health_loss,
		 cumulative_health_gain,
		 characterId]
	);
};